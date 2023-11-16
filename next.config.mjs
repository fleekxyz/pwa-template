/**
 * @type {import('next').NextConfig}
 */
export default {
  images: {
    loader: 'custom',
    loaderFile: './supabase-image-loader.mjs',
  },
  output: 'export',
}
