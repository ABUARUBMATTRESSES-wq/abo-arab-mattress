// Turnstile keys: production builds keep the real sitekey; only the isolated
// impl/track-admin preview branch gets the official Cloudflare testing sitekey
// (https://developers.cloudflare.com/turnstile/troubleshooting/testing/) so the
// preview can run end-to-end order tests. Any other/missing branch falls back
// to the production key (fail-safe for production).
const TURNSTILE_SITEKEY =
  process.env.CF_PAGES_BRANCH === "impl/track-admin"
    ? "1x00000000000000000000AA"
    : "0x4AAAAAAGNxoLS_4jeZj30N";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  env: {
    NEXT_PUBLIC_TURNSTILE_SITEKEY: TURNSTILE_SITEKEY,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
