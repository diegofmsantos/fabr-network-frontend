/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove a configuração do analytics daqui, pois já está no layout.tsx
  
  reactStrictMode: true,
  
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'assets.vercel.com' },
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
    ],
  },
};

export default nextConfig;