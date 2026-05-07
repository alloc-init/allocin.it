module.exports = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"]
    });

    return config;
  },
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/home"
      },
      {
        source: "/admin",
        destination: "/admin/index.html"
      }
    ];
  },
  async redirects() {

    return [

      {

        source: "/posts/challanges",

        destination: "https://allocinit.notion.site/challenges",

        permanent: true,

      },

    ];

  },
};