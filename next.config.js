/** @type {import('next').NextConfig} */
const nextConfig = {
  // TODO: google-map-react is not compatible with strict mode. Switch to a package that supports it.
  reactStrictMode: false,
  swcMinify: true,

  // SVG loader
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: {
        loader: '@svgr/webpack',
        options: {
          prettier: false,
          svgo: true,
          svgoConfig: {
            plugins: [
              {
                name: 'removeViewBox',
                active: false,
              },
            ],
          },
          titleProp: true,
        },
      },
    });
    return config;
  },

  output: 'standalone',
};

module.exports = nextConfig;
