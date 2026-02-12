# Specification

## Summary
**Goal:** Fix lobby creation failures for authenticated Internet Identity users by correcting backend authorization and improving Lobby screen gating/error messaging.

**Planned changes:**
- Backend: adjust authorization so authenticated principals can create a lobby via `joinLobby`, while the anonymous principal remains blocked with a clear unauthorized error.
- Backend: allow first-time authenticated users to save a profile via `saveCallerUserProfile` without requiring pre-existing `#user` permissions; keep anonymous blocked and preserve existing profile loading via `getCallerUserProfile`.
- Frontend: improve Lobby “Create New Lobby” failure messaging to show a user-friendly, more specific reason when available (including backend error text when present).
- Frontend: prevent unauthenticated users from attempting lobby creation by disabling/gating “Create New Lobby” when not signed in and prompting sign-in; enable the action immediately after sign-in without reload.

**User-visible outcome:** Signed-in users can create lobbies successfully and see clearer error messages when something goes wrong; signed-out users are prompted to sign in and cannot attempt lobby creation.
