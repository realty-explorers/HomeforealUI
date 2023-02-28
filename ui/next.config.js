const withImages = require('next-images');

const redirects = {
  async redirects() {
    return [
      {
        source: '/dashboards',
        destination: '/dashboards/real-estate',
        permanent: true
      }
    ];
  }
};

const config = {
  redirects,
  typescript: {
    ignoreBuildErrors: true,
  }
}

module.exports = withImages(config);
