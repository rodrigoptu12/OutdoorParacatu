// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost"],
    // Adicione aqui os domínios externos das imagens, se necessário
    // Por exemplo, se você for usar imagens do cloudinary:
    // domains: ['res.cloudinary.com'],
  },
  // Outras configurações
};

module.exports = nextConfig;
