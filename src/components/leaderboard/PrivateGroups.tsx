'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { getUniquePersistentGuestId } from '@/lib/guestId';
import { groupAction, type GroupBoard, type GroupPeriod, type PrivateGroup } from '@/lib/private-groups';

const inputClass = 'w-full rounded-lg border border-white/20 bg-slate-900 px-3 py-2 text-white';
const buttonClass = 'rounded-lg bg-cyan-700 px-4 py-2 font-semibold text-white hover:bg-cyan-600 disabled:opacity-50';
const secondaryClass = 'rounded-lg border border-white/20 px-4 py-2 hover:bg-white/10 disabled:opacity-50';
const periods: { value: GroupPeriod; label: string }[] = [
  { value: 'weekly', label: 'This week' },
  { value: 'monthly', label: 'This month' },
  { value: 'all-time', label: 'All time' },
];

export default function PrivateGroups() {
  const [groups, setGroups] = useState<PrivateGroup[]>([]);
  const [selected, setSelected] = useState('');
  const [board, setBoard] = useState<GroupBoard | null>(null);
  const [period, setPeriod] = useState<GroupPeriod>('weekly');
  const [name, setName] = useState('');
  const [invite, setInvite] = useState('');
  const [alias, setAlias] = useState('');
  const [busy, setBusy] = useState(true);
  const [boardLoading, setBoardLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [revision, setRevision] = useState(0);
  const actionPending = useRef(false);

  useEffect(() => {
    let active = true;
    // Fragment invites stay out of server logs and referrer URLs.
    const code = new URLSearchParams(window.location.hash.slice(1)).get('invite');
    if (code) {
      setInvite(code);
      window.history.replaceState(null, '', window.location.pathname);
    }
    groupAction<PrivateGroup[]>('list').then(data => {
      if (!active) return;
      setGroups(data);
      setSelected(data[0]?.id || '');
    }).catch(err => { if (active) setError(message(err)); })
      .finally(() => { if (active) setBusy(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;
    setBoard(null);
    if (!selected) { setBoardLoading(false); return; }
    setBoardLoading(true);
    groupAction<GroupBoard>('board', { p_group_id: selected, p_timeframe: period })
      .then(data => { if (active) setBoard(data); })
      .catch(err => { if (active) setError(message(err)); })
      .finally(() => { if (active) setBoardLoading(false); });
    return () => { active = false; };
  }, [selected, period, revision]);

  function message(err: unknown) {
    return err instanceof Error ? err.message : 'Something went wrong. Please try again.';
  }

  async function run(action: () => Promise<void>) {
    if (actionPending.current) return;
    actionPending.current = true;
    setBusy(true);
    setError('');
    setNotice('');
    try { await action(); }
    catch (err) { setError(message(err)); }
    finally { actionPending.current = false; setBusy(false); }
  }

  async function enterGroup(mode: 'create' | 'join') {
    await run(async () => {
      const code = invite.trim().toLowerCase();
      if (mode === 'join' && !/^[a-f0-9]{8}(-[a-f0-9]{4}){3}-[a-f0-9]{12}$/.test(code)) {
        throw new Error('Enter the full invite code shared by a group member.');
      }
      const guest = await getUniquePersistentGuestId();
      setAlias(guest);
      const result = await groupAction<{ id: string }>(mode, {
        p_alias: guest,
        ...(mode === 'create' ? { p_name: name.trim() } : { p_invite: code }),
      });
      setGroups(await groupAction<PrivateGroup[]>('list'));
      setSelected(result.id);
      setRevision(value => value + 1);
      setName('');
      setInvite('');
      setNotice(mode === 'create' ? 'Group created. Share an invite to bring people in.' : 'You joined the group. Your new saved scores will count here.');
    });
  }

  async function manage(action: 'leave' | 'delete' | 'rotate') {
    if (!board) return;
    const prompts = {
      leave: 'Leave this group? Rejoining will start your group score from zero.',
      delete: 'Delete this group and all memberships? Individual trivia scores will be kept.',
      rotate: 'Reset the invite code? Old invites will stop working. Existing members will stay.',
    };
    if (!window.confirm(prompts[action])) return;
    await run(async () => {
      await groupAction(action, { p_group_id: board.id });
      if (action === 'rotate') {
        setBoard(null);
        setRevision(value => value + 1);
        setNotice('Invite reset. Share the new code or link.');
      } else {
        const remaining = await groupAction<PrivateGroup[]>('list');
        setGroups(remaining);
        setSelected(remaining[0]?.id || '');
        setNotice(action === 'delete' ? 'Group deleted.' : 'You left the group.');
      }
    });
  }

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-10 text-gray-100">
      <Link href="/leaderboard" className="text-cyan-300 hover:underline">← Global leaderboard</Link>
      <h1 className="mt-5 text-3xl font-bold">Private group leaderboards</h1>
      <p className="mt-3 text-gray-300">A little friendly competition for your friends, family, or classroom. Create a group, share the invite, and earn points as you play.</p>
      <p className="mt-3 text-sm text-gray-400">Membership stays in this browser. Keep your guest alias to keep earning points for the same player. Clearing browser data loses access to your groups.</p>

      {error && <p role="alert" className="mt-5 rounded-lg border border-red-400/40 bg-red-950/40 p-3">{error}</p>}
      <p role="status" className="mt-3 text-cyan-200">{notice}</p>

      <div className="my-6 grid gap-5 md:grid-cols-2">
        <form onSubmit={event => { event.preventDefault(); void enterGroup('create'); }} className="rounded-xl border border-white/10 bg-slate-950/70 p-5">
          <h2 className="mb-4 text-xl font-semibold">Start a group</h2>
          <label htmlFor="group-name" className="mb-2 block">Group name</label>
          <input id="group-name" value={name} onChange={event => setName(event.target.value)} maxLength={60} required placeholder="Friday quiz crew" className={inputClass} />
          <button disabled={busy || !name.trim()} className={`${buttonClass} mt-4`}>Create group</button>
        </form>
        <form onSubmit={event => { event.preventDefault(); void enterGroup('join'); }} className="rounded-xl border border-white/10 bg-slate-950/70 p-5">
          <h2 className="mb-4 text-xl font-semibold">Have an invite?</h2>
          <label htmlFor="group-invite" className="mb-2 block">Invite code</label>
          <input id="group-invite" value={invite} onChange={event => setInvite(event.target.value)} maxLength={36} required autoComplete="off" spellCheck={false} className={inputClass} />
          <button disabled={busy || !invite.trim()} className={`${buttonClass} mt-4`}>Join group</button>
        </form>
      </div>

      {busy && <p role="status">Working…</p>}
      {!busy && !error && groups.length === 0 && <p className="py-6 text-gray-300">You haven’t joined a group yet. Start one above or ask a friend for an invite.</p>}
      {groups.length > 0 && (
        <section className="rounded-xl border border-white/10 bg-slate-950/70 p-5" aria-label="Your group rankings">
          <label htmlFor="group-select" className="mb-2 block font-semibold">Your groups</label>
          <select id="group-select" value={selected} disabled={busy} onChange={event => { setSelected(event.target.value); setError(''); setNotice(''); }} className={inputClass}>
            {groups.map(group => <option key={group.id} value={group.id}>{group.name}</option>)}
          </select>
          <p className="mt-3 text-sm text-gray-400">Your group alias: {groups.find(group => group.id === selected)?.alias || alias}</p>
          <div className="my-5 flex flex-wrap gap-2" aria-label="Ranking period">
            {periods.map(item => <button key={item.value} disabled={busy} aria-pressed={period === item.value} onClick={() => { setPeriod(item.value); setError(''); }} className={period === item.value ? buttonClass : secondaryClass}>{item.label}</button>)}
            <button disabled={busy || boardLoading} onClick={() => { setError(''); setRevision(value => value + 1); }} className={secondaryClass}>Refresh</button>
          </div>
          <p className="mb-4 text-sm text-gray-400">Only saved web trivia scores earned after joining count. Weeks start Monday; weeks and months reset at midnight UTC. Practice results and multiplayer room scores do not count.</p>
          {boardLoading && <p role="status">Loading rankings…</p>}
          {board && board.id === selected && !boardLoading && <>
            <h2 className="mb-4 text-2xl font-bold">{board.name}</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <caption className="sr-only">{board.name}: {periods.find(item => item.value === period)?.label} rankings</caption>
                <thead><tr className="border-b border-white/20"><th scope="col" className="p-3">Rank</th><th scope="col" className="p-3">Player</th><th scope="col" className="p-3 text-right">Points</th><th scope="col" className="p-3 text-right">Games</th></tr></thead>
                <tbody>{board.members.map(member => <tr key={member.name} className={member.isYou ? 'border-b border-white/10 bg-cyan-950/50' : 'border-b border-white/10'}>
                  <td className="p-3">{member.rank}</td><th scope="row" className="p-3 font-medium">{member.name}{member.isYou && ' (you)'}</th><td className="p-3 text-right">{member.score.toLocaleString()}</td><td className="p-3 text-right">{member.games}</td>
                </tr>)}</tbody>
              </table>
            </div>
            {board.members.every(member => member.games === 0) && <p className="mt-4 text-gray-300">No scores in this period yet. Play a quiz to get the competition started.</p>}
            <Link href="/daily-trivias" className="mt-5 inline-block text-cyan-300 hover:underline">Play daily trivia →</Link>
            <div className="mt-6 border-t border-white/10 pt-5">
              <h3 className="font-semibold">Invite people you know</h3>
              <p className="my-2 text-sm text-gray-400">Anyone with this invite can join and see member aliases and group rankings. Share it privately.</p>
              <label htmlFor="current-invite" className="sr-only">Current invite code</label>
              <input id="current-invite" readOnly value={board.inviteCode} className={inputClass} onFocus={event => event.target.select()} />
              <div className="mt-3 flex flex-wrap gap-3">
                <button disabled={busy} className={buttonClass} onClick={() => void run(async () => {
                  try { await navigator.clipboard.writeText(`${window.location.origin}/leaderboard/groups#invite=${board.inviteCode}`); }
                  catch { throw new Error('Could not copy the link. Select and copy the invite code above instead.'); }
                  setNotice('Invite link copied.');
                })}>Copy invite link</button>
                {board.isOwner && <button disabled={busy} className={secondaryClass} onClick={() => void manage('rotate')}>Reset invite</button>}
                <button disabled={busy} className={`${secondaryClass} text-red-300`} onClick={() => void manage(board.isOwner ? 'delete' : 'leave')}>{board.isOwner ? 'Delete group' : 'Leave group'}</button>
              </div>
            </div>
          </>}
        </section>
      )}
    </main>
  );
}
