# Specification

## Summary
**Goal:** Make the Vite production build output folder name configurable while keeping `dist` as the default, and update itch.io build docs accordingly.

**Planned changes:**
- Add a supported configuration method (e.g., environment variable) to override Vite’s `build.outDir`, defaulting to `dist` when unset.
- Ensure the configured output directory is used consistently for production builds while keeping the existing relative base path behavior (`base: "./"`).
- Update the itch.io build documentation to explain the default folder (`dist`), how to change it, and that users should zip the configured output folder containing `index.html` for upload.

**User-visible outcome:** Users can build the app to `dist` by default or configure a different output folder name without repeatedly editing source files, and can follow updated docs to know which folder to zip for itch.io.
