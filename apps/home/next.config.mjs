/** @type {import('next').NextConfig} */
const nextConfig = {
    rewrites: async () => {
        return [
            {
                source: "/speeed",
                destination: "speeed.najjgames.com"
            }
        ]
    }
};

export default nextConfig;
