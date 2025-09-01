import { createMDX } from 'fumadocs-mdx/next';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true
};

const withMDX = createMDX();
const mdxConfig = withMDX(nextConfig);

if (mdxConfig.experimental?.turbo) {
  mdxConfig.turbopack = mdxConfig.experimental.turbo;
  delete mdxConfig.experimental.turbo;
}

export default mdxConfig;
