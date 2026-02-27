import type { NextConfig } from "next";
const withSvgr = require('next-plugin-svgr');

const nextConfig: NextConfig = {
  reactStrictMode: false, // Habilitar modo estricto de React
  turbopack: {}, // Deshabilitar Turbopack si no lo necesitas
  compiler: {
    styledComponents: true, // Habilitar soporte para styled-components
  },
};

export default withSvgr(nextConfig); // Aplicar el plugin SVGR
