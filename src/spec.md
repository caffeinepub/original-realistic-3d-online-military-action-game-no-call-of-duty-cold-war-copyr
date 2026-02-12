# Specification

## Summary
**Goal:** Add a true offline mode and expand single-player gameplay with a dedicated offline skirmish that runs entirely client-side.

**Planned changes:**
- Add a clearly labeled offline-only entry point from the home menu that does not require Internet Identity sign-in.
- Ensure offline gameplay screens never trigger backend/canister queries or React Query polling, and remain playable even when the backend/network is unreachable (no repeated error toasts or blocked UI).
- Implement a new “Offline Skirmish” mode (separate from Training) using the existing FPS controls/weapon handling with at least one locally simulated non-player entity/target.
- Add basic offline HUD stats/scoring (e.g., hit count/accuracy/time-based score) that updates during play.
- Add at least one additional weapon option/behavior and allow switching between at least two weapons during offline play, with input instructions shown in the pause menu.
- Keep online multiplayer/lobby behavior unchanged and ensure all added content remains original (no copyrighted COD/Cold War assets, names, or UI styling).

**User-visible outcome:** Players can start and play an offline skirmish without signing in or needing a backend connection, track basic stats/score, and switch between at least two weapons; online mode continues to work as before for signed-in users.
