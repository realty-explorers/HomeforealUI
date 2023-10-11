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
  };
  return nextConfig;
};

// const config = {
//   typescript: {
//     ignoreBuildErrors: true,
//   },
// };

// module.exports = withImages(config);
