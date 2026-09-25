// Run with: PGLITE_MODULE=/path/to/@electric-sql/pglite/dist/index.js node scripts/test-private-groups.mjs
// Uses an isolated PostgreSQL engine; never connects to Supabase.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const { PGlite } = await import(process.env.PGLITE_MODULE || '@electric-sql/pglite');
const db = new PGlite();
const owner = 'a'.repeat(64);
const friend = 'b'.repeat(64);
const stranger = 'c'.repeat(64);
let checks = 0;

async function action(kind, secret, { id = null, name = null, alias = null, invite = null, period = 'weekly' } = {}) {
  const { rows } = await db.query('select public.private_group_action($1,$2,$3,$4,$5,$6,$7) as result',
    [kind, secret, id, name, alias, invite, period]);
  return rows[0].result;
}
async function rejects(fn, pattern) {
  await assert.rejects(fn, pattern);
  checks++;
}
function equal(actual, expected) { assert.deepEqual(actual, expected); checks++; }

try {
  await db.exec(`
    create role anon; create role authenticated;
    create table public.trivia_scores (
      name text, score integer, platform text default 'web', created_at timestamptz default now()
    );
  `);
  await db.exec(await readFile(new URL('../supabase/migrations/20260925_add_private_group_leaderboards.sql', import.meta.url), 'utf8'));
  await db.exec('set role anon');
  await rejects(() => db.query('select * from public.trivia_groups'), /permission denied/);
  await rejects(() => db.query('select * from public.trivia_group_members'), /permission denied/);
  await rejects(() => action('list', 'guessable'), /Invalid membership secret/);
  await rejects(() => action('create', owner, { name: ' ', alias: 'Owner' }), /group name/);
  await rejects(() => action('create', owner, { name: 'Friends', alias: '' }), /guest alias/);
  const { id } = await action('create', owner, { name: 'Friends', alias: 'Owner' });
  let board = await action('board', owner, { id });
  equal(board.members, [{ rank: 1, name: 'Owner', isYou: true, score: 0, games: 0 }]);
  equal(board.isOwner, true);
  equal(Object.keys(board).sort(), ['id', 'inviteCode', 'isOwner', 'members', 'name']);
  equal(await action('list', stranger), []);
  await rejects(() => action('board', stranger, { id }), /membership required/);
  await rejects(() => action('join', friend, { invite: '00000000-0000-0000-0000-000000000000', alias: 'Friend' }), /invalid or has been reset/);
  await rejects(() => action('join', friend, { invite: board.inviteCode, alias: 'Owner' }), /already a member/);
  equal((await action('join', friend, { invite: board.inviteCode, alias: 'Friend' })).id, id);
  equal((await action('join', friend, { invite: board.inviteCode, alias: 'Friend' })).id, id);
  equal((await action('board', friend, { id })).isOwner, false);
  await rejects(() => action('rotate', friend, { id }), /Only the group owner/);
  await rejects(() => action('delete', friend, { id }), /Only the group owner/);
  await rejects(() => action('leave', owner, { id }), /owner must delete/);
  await rejects(() => action('board', owner, { id, period: 'daily' }), /Invalid timeframe/);
  await rejects(() => action('unknown', owner, { id }), /Unknown group action/);
  await db.exec(`reset role;
    update public.trivia_group_members set joined_at = now() - interval '90 days';
    insert into public.trivia_scores(name, score, platform, created_at) values
      ('Owner', 100, 'web', now()), ('Friend', 100, 'web', now()),
      ('Owner', 500, 'web', now() - interval '100 days'),
      ('Owner', 700, 'mobile', now()), ('Stranger', 900, 'web', now()),
      ('Owner', 40, 'web', now() - interval '40 days');
    set role anon;
  `);
  board = await action('board', owner, { id });
  equal(board.members.map(m => [m.name, m.rank, m.score, m.games]), [['Friend', 1, 100, 1], ['Owner', 1, 100, 1]]);
  equal((await action('board', owner, { id, period: 'monthly' })).members.map(m => m.score), [100, 100]);
  equal((await action('board', owner, { id, period: 'all-time' })).members.map(m => [m.name, m.score]), [['Owner', 140], ['Friend', 100]]);
  const oldInvite = board.inviteCode;
  await action('rotate', owner, { id });
  board = await action('board', owner, { id });
  assert.notEqual(board.inviteCode, oldInvite); checks++;
  await rejects(() => action('join', stranger, { invite: oldInvite, alias: 'Stranger' }), /invalid or has been reset/);
  equal((await action('board', friend, { id })).members.length, 2);
  await action('leave', friend, { id });
  await rejects(() => action('board', friend, { id }), /membership required/);
  equal(await action('list', friend), []);
  await action('join', friend, { invite: board.inviteCode, alias: 'Friend' });
  equal((await action('board', friend, { id, period: 'all-time' })).members.find(m => m.isYou).score, 0);
  // Calendar boundaries use UTC regardless of the database session timezone.
  await db.exec(`reset role;
    delete from public.trivia_scores;
    insert into public.trivia_scores(name, score, created_at) values
      ('Owner', 11, date_trunc('week', now() at time zone 'UTC') at time zone 'UTC'),
      ('Owner', 99, (date_trunc('week', now() at time zone 'UTC') at time zone 'UTC') - interval '1 second');
    set timezone = 'Asia/Singapore'; set role anon;
  `);
  equal((await action('board', owner, { id })).members.find(m => m.isYou).score, 11);
  await db.exec('set role authenticated');
  await rejects(() => db.query('select * from public.trivia_group_members'), /permission denied/);
  equal((await action('board', owner, { id })).id, id);
  await db.exec('set role anon');
  for (let i = 0; i < 19; i++) await action('create', owner, { name: `Extra ${i}`, alias: 'Owner' });
  await rejects(() => action('create', owner, { name: 'Too many', alias: 'Owner' }), /at most 20/);
  equal((await action('list', owner)).length, 20);
  // Joining an existing membership is idempotent, even at the group limit.
  equal((await action('join', owner, { invite: board.inviteCode, alias: 'Owner' })).id, id);
  await db.exec(`reset role;
    insert into public.trivia_group_members(group_id, member_hash, guest_alias)
      select '${id}', 'test-' || n, 'Extra' || n from generate_series(1,98) n;
    set role anon;
  `);
  await rejects(() => action('join', stranger, { invite: board.inviteCode, alias: 'Stranger' }), /100 member limit/);
  await action('delete', owner, { id });
  equal((await action('list', owner)).length, 19);
  equal(await action('list', friend), []);
  await rejects(() => action('join', stranger, { invite: board.inviteCode, alias: 'Stranger' }), /invalid or has been reset/);
  await db.exec('reset role');
  equal((await db.query('select count(*)::integer as count from public.trivia_scores')).rows[0].count, 2);
  console.log(`Passed ${checks} private-group database checks.`);
} finally { await db.close(); }
