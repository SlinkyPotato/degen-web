/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  distDir: 'dist',
  webpack: (config) => {
    config.experiments = {
      topLevelAwait: true,
      layers: true,
    };
    return config;
  },
};
