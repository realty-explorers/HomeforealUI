const withImages = require('next-images');

// const redirects = {
//   async redirects() {
//     return [
//       {
//         source: "/dashboards",
//         destination: "/dashboards/real-estate",
//         permanent: true,
//       },
//     ];
//   },
// };
module.exports = async (phase, { defaultConfig }) => {
  /**
   * @type {import('next').NextConfig}
   */
  const nextConfig = {
    transpilePackages: ['next-auth'],
    typescript: {
      ignoreBuildErrors: true
    },

    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '**'
        },

        {
          protocol: 'http',
          hostname: '**'
        }
      ]
      // images: {
      // loader: "custom",
      // loaderFile: "./public/static/images/placeholders/covers/house_bg.jpg",
      // },
    },
    async rewrites() {
      return [
        {
          source: '/ingest/static/:path*',
          destination: 'https://us-assets.i.posthog.com/static/:path*'
        },
        {
          source: '/ingest/:path*',
          destination: 'https://us.i.posthog.com/:path*'
        },
        {
          source: '/ingest/decide',
          destination: 'https://us.i.posthog.com/decide'
        }
      ];
    },
    // This is required to support PostHog trailing slash API requests
    skipTrailingSlashRedirect: true
  };
  return nextConfig;
};

// const config = {
//   typescript: {
//     ignoreBuildErrors: true,
//   },
// };
//
// module.exports = withImages(config);
