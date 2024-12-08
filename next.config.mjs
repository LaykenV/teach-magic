/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    dynamicIO: true,
  },
    reactStrictMode: true,
    images: {
             domains: ['oaidalleapiprodscus.blob.core.windows.net', 'res.cloudinary.com'],
    },
  };;

export default nextConfig;