/** @type {import('next').NextConfig} */

const nextConfig = {
  output: 'standalone',
  // Optional: Change links `/me` -> `/me/` and emit `/me.html` -> `/me/index.html`
  // trailingSlash: true,
  // Optional: Prevent automatic `/me` -> `/me/`, instead preserve `href`
  // skipTrailingSlashRedirect: true,
  // Optional: Change the output directory `out` -> `dist`
  distDir: 'dist',
  reactStrictMode: false,
};

module.exports = nextConfig;

// command to use when export, instead of next start : npx serve@latest out
