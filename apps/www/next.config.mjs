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
      },
      {
        source: '/tokens/:path*.mdx',
        destination: '/tokens.mdx/:path*'
      }
    ];
  },
  async redirects() {
    return [
      // TODO: remove this once we have a proper home page
      {
        source: '/',
        destination: '/docs',
        permanent: true
      },
      // DataView moved out of Components into its own section.
      {
        source: '/docs/components/dataview',
        destination: '/docs/dataview',
        permanent: true
      },
      {
        source: '/docs/components/dataview/:path*',
        destination: '/docs/dataview/:path*',
        permanent: true
      }
    ];
  }
};

const withMDX = createMDX();

export default withMDX(config);
