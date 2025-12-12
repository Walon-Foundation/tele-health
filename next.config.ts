import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  // Disable in development since Turbopack doesn't support Serwist yet
  disable: process.env.NODE_ENV !== "production",
});

export default withSerwist({
  // Suppress Turbopack warning - Serwist will only work in production builds
  turbopack: {},
});
