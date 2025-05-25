/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  },
  output_location: "out",
  app_build_command: "npm run build && npx next export",
  skip_app_build: false
};

module.exports = nextConfig;