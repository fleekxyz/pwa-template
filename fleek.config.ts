import { FleekConfig } from '@fleekxyz/cli'

export default {
  sites: [
    {
      slug: 'scarce-lion-long',
      distDir: 'out',
      buildCommand: 'pnpm run build',
    },
  ],
} satisfies FleekConfig
