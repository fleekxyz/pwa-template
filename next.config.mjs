/**
 * @type {import('next').NextConfig}
 */
export default {
  images: {
    remotePatterns: [
      {
        hostname: 'ens.domains',
      },
      {
        hostname: 'ipfs.io',
      },
    ],
  },
  output: 'export',
}
