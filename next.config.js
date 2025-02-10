const withImages = require("next-images");

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
    typescript: {
      ignoreBuildErrors: true,
    },

    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "**",
        },

        {
          protocol: "http",
          hostname: "**",
        },
      ],
      // images: {
      // loader: "custom",
      // loaderFile: "./public/static/images/placeholders/covers/house_bg.jpg",
      // },
    },
  };
  return nextConfig;
};

// const config = {
//   typescript: {
//     ignoreBuildErrors: true,
//   },
// };

// module.exports = withImages(config);
