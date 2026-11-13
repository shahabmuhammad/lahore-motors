import type { NextConfig } from "next";

const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1];

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath:
    process.env.GITHUB_ACTIONS === "true" && repositoryName
      ? `/${repositoryName}`
      : "",
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
