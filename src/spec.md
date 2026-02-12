# Specification

## Summary
**Goal:** Fix backend authorization so authenticated Internet Identity users can create and manage multiplayer lobbies reliably, while anonymous callers remain blocked, and improve lobby UI error messaging.

**Planned changes:**
- Adjust backend authorization in `joinLobby` so authenticated Internet Identity callers can create/persist lobbies and see them in `getActiveLobbies`, while anonymous callers trap with an Unauthorized error.
- Remove or revise backend permission checks that depend on `#user` permissions in a way that blocks normal authenticated gameplay (e.g., `leaveLobby`, `updatePlayerPosition`, `getPlayersInGame`, `startGame`, `endGame`), while continuing to reject anonymous callers for multiplayer state-changing actions.
- Update the Lobby UI to display specific, English error messages that reflect the actual backend failure reason during lobby creation, while keeping raw error logging in the console and maintaining existing auth gating.

**User-visible outcome:** Signed-in users can create and play in multiplayer lobbies without unexpected Unauthorized errors, and if lobby creation fails, they see a clear English reason instead of a generic failure message.
