/**
 * Helper to generate asset URLs that work with relative base paths.
 * This ensures assets load correctly when hosted from a subpath (e.g., on itch.io).
 */
export function getAssetUrl(path: string): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // In production builds with relative base, assets are resolved relative to index.html
  // In development, Vite handles absolute paths correctly
  if (import.meta.env.DEV) {
    return `/${cleanPath}`;
  }
  
  return `./${cleanPath}`;
}
