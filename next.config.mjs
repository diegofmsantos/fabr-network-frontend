/** @type {import('next').NextConfig} */
const nextConfig = {
    // Habilita o Analytics da Vercel
    analytics: {
      vercel: true,
    },
    
    // Suas outras configurações existentes (se houver)
    reactStrictMode: true,
    
    // Se você tiver imagens de domínios externos, mantenha isso
    images: {
      domains: ['assets.vercel.com'],
      unoptimized: true,
    },
  };
  
  export default nextConfig;