# Private group leaderboards

## Enable the feature

Apply `supabase/migrations/20260925_add_private_group_leaderboards.sql` to the
same Supabase project used by the website, using the project's migration workflow
or Supabase SQL editor. Then deploy the application changes. No new environment
variables or service-role keys are needed. Until the migration is applied, the
page reports that group leaderboards are unavailable.

The page is `/leaderboard/groups`. Links appear on the homepage, global
leaderboard, and trivia results. Group data is loaded only after membership is
checked; the page is `noindex` and has a no-referrer policy. Invite links carry
the code in a URL fragment rather than a query string. Opening an invite fills
the form; joining requires clicking Join group.

## Rules

- Up to 20 groups per browser identity and 100 members per group.
- Creating a group also joins its owner. Every member can share an invite.
- The owner can reset invites or delete the group. Other members can leave.
- Resetting an invite keeps existing members but invalidates the old code.
- Rankings sum existing `trivia_scores` with `platform = 'web'`, matching the
  member's exact reserved guest alias and counting only scores since joining.
- Weekly periods start Monday 00:00 UTC; monthly periods start on the first day
  at 00:00 UTC. All time means since joining. Equal totals share a rank.
- Members with no scores remain visible. Practice results that are not saved
  and multiplayer room scores are not included. Refresh reloads the standings.
- Leaving and rejoining starts a new scoring period. Deleting a group does not
  delete any individual trivia scores.

## Identity and access

This follows the site's existing guest flow. A cryptographically random 256-bit
membership secret lives in local storage; the database stores its SHA-256 hash.
Group tables have RLS enabled with no direct anonymous/authenticated table
access. The narrowly scoped `private_group_action` function checks membership
and ownership before returning data or changing a group. It never returns hashes.
Invites are random UUID capabilities; possession allows joining and then seeing
the group's aliases and standings. They should only be shared with intended members.

Membership is browser-specific, with no cross-device recovery. Clearing storage
loses access, including owner controls. Rerolling the public guest alias does not
change existing memberships: future scores under the new alias will not count for
the old member. The interface explains this. Guests can leave and rejoin under
their new alias, but an owner would need to recreate the group.

Guest aliases and existing score submission are not authenticated identities.
The new secret protects private memberships, but it does not make the existing
public score system tamper-proof or prove ownership of a submitted guest alias.
These are casual group standings, not a verified competition system.

## Validation

`scripts/test-private-groups.mjs` runs the migration in an isolated PGlite
PostgreSQL database and exercises access controls, lifecycle operations,
invite rotation, score filtering, calendar periods, ties, and membership limits.
It does not connect to the live database. Install `@electric-sql/pglite` in a
temporary directory, then run:

```sh
PGLITE_MODULE=/path/to/node_modules/@electric-sql/pglite/dist/index.js node scripts/test-private-groups.mjs
```

For deployment smoke testing, use two separate browser profiles to create and
join a group, save a quiz score after joining, and refresh the board. Confirm
invite reset and leave/delete behavior using a disposable test group.
