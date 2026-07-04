import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Album artwork is always hot-linked from the official CDNs (Spotify /
  // Apple) — never rehosted — so plain <img> tags are used and no remote
  // image domains need to be configured here.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // YouTube embeds require a valid referer; never strip it.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
