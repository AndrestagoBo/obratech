import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
