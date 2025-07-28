/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb' // adjust as needed (e.g. '10mb', '100mb')
    }
  }
};

export default nextConfig;
