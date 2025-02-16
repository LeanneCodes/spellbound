/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "storage.googleapis.com", // Change this to match the actual image source domain
        },
        {
          protocol: "https",
          hostname: "www.nytimes.com", // If NYT images come from this domain
        },
      ],
    },
  };
  
  export default nextConfig;
  