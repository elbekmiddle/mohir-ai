module.exports = {
  i18n: {
    // providing the locales supported by your application
    locales: ["uz-UZ", "en-US", "ru-RU"],
    //  default locale used when the non-locale paths are visited
    defaultLocale: "uz-UZ",
    localeDetection: false,
  },

  reactStrictMode: true,
  swcMinify: true,

/*************  ✨ Windsurf Command ⭐  *************/
  /**
   * Proxying requests from /api/* to https://api.mohir.uzbekvoice.ai/*
   * This is necessary because the API is hosted on a different domain than the frontend.
   * The API is hosted on a digitalocean droplet, and the frontend is hosted on Vercel.
   * Next.js does not support proxying requests to a different domain out of the box.
   * Therefore, we need to use the rewrites API to proxy the requests.

/*******  75354f3c-6521-4f20-978c-38f6d66f6781  *******/
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://api.mohir.uzbekvoice.ai/:path*", // Proxy to Backend
      },
    ];
  },

  // async redirects() {
  //   return [     
  //     {
  //       source: '/pricing',
  //       destination: '/',
  //       permanent: false,
  //     },
  //   ]
  // },
};

// publicRuntimeConfig: {
//   url: process.env.DIRECTUS_URL,
// },
// serverRuntimeConfig: {
//   email: process.env.DIRECTUS_EMAIL,
//   password: process.env.DIRECTUS_PASSWORD,
//   // token: process.env.DIRECTUS_STATIC_TOKEN,
// },
