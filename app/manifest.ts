import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Fleek PWA Template',
    short_name: 'Fleek PWA Template',
    orientation: 'any',
    icons: [
      {
        src: 'icons/flk-48.png',
        sizes: '48x48',
        type: 'image/png',
      },
      {
        src: 'icons/flk-96.png',
        sizes: '96x96',
        type: 'image/png',
      },
      {
        src: 'icons/flk-128.png',
        sizes: '128x128',
        type: 'image/png',
      },
      {
        src: 'icons/flk-256.png',
        sizes: '256x256',
        type: 'image/png',
      },
    ],
    start_url: '/',
    background_color: '#ffffff',
    display: 'standalone',
    scope: '/',
    theme_color: '#C9FF57',
  }
}
