/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        // هذا هو اسم الخادم الذي يستضيف كل صورك
        hostname: 'haevprzeuadrclhiobqo.supabase.co', 
        port: '',
        // وهذا يعني "اسمح بأي مسار يبدأ بهذا الشكل"
        pathname: '/storage/v1/object/public/**', 
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.google.com',
        port: '',
        pathname: '/maps/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      // YouTube thumbnails
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        port: '',
        pathname: '/**',
      },
      { protocol: 'https', hostname: 'i0.ytimg.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'i1.ytimg.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'i2.ytimg.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'i3.ytimg.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'i4.ytimg.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'i5.ytimg.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'i6.ytimg.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'i7.ytimg.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'i8.ytimg.com', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'i9.ytimg.com', port: '', pathname: '/**' },
    ],
  },
}

export default nextConfig
