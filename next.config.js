/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    images: {
        unoptimized: true, // 禁用图片优化
        loader: "imgix", // 或其他静态图片加载器
        path: "",
        remotePatterns: [
          {
            protocol: "https",
            hostname: "image.tmdb.org",
            port: "",
            pathname: "/**",
          },
        ],
    },
    reactStrictMode: true,
    compiler: {
        styledComponents: true,
    },
    output: "export", // 添加这一行，配置为静态导出
};
module.exports = nextConfig;
