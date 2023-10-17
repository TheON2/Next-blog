// @ts-check

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  // 다른 Next.js 설정들이 여기 올 수 있습니다.

  images: {
    domains: ["images.unsplash.com"], // 여기에 허용하고자 하는 도메인들을 추가합니다.
  },
};

module.exports = nextConfig;
