import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // El celular entra por la IP de la red. Sin esto Next bloquea el JavaScript
  // y la página se ve, pero los botones no responden.
  allowedDevOrigins: ["192.168.2.17", "192.168.*.*"],
  images: {
    qualities: [75, 90],
  },
  async rewrites() {
    return {
      beforeFiles: [
        // Las fotos subidas después de arrancar no las sirve la carpeta public.
        // Esta ruta las lee del disco en cada petición.
        { source: "/images/uploads/:file", destination: "/api/media/:file" },
      ],
    };
  },
};

export default nextConfig;
