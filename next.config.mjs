const nextConfig = {
  output: "standalone",
  productionBrowserSourceMaps: false,
  transpilePackages: ["@t3-oss/env-nextjs"],
  compress: true,
  poweredByHeader: false,
}

export default nextConfig
