import { createMDX } from 'fumadocs-mdx/next';

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true
  },
  experimental: {
    optimizePackageImports: ['shiki']
  },
  async rewrites() {
    return [
      {
        source: '/docs/:path*.mdx',
        destination: '/llms.mdx/:path*'
      },
      {
        source: '/docs/:path*.md',
        destination: '/llms.mdx/:path*'
      }
    ];
  }
};

const withMDX = createMDX();

export default withMDX(config);
