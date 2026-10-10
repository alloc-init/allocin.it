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
        source: "/writings/:path*",
        destination: "/posts/:path*",
        permanent: true
      },
      {
        source: "/research",
        destination: "/posts",
        permanent: true
      },
      {
        source: "/research/:filename",
        destination: "/posts/:filename-paper",
        permanent: true
      },
      {
        source: "/papers/:filename",
        destination: "/posts/:filename-paper",
        permanent: true
      },
      {
        source: "/papers",
        destination: "/posts#research",
        permanent: true
      }
    ];
  },
};
