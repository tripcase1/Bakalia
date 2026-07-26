import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://alherafresh.com';

  const routes = [
    '',
    '/products',
    '/products/padma-river-hilsa-ilish',
    '/products/chittagong-sea-rupchanda',
    '/products/sundarban-natural-raw-honey',
    '/products/rajshahi-katimon-mango',
    '/checkout',
    '/dashboard',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: route === '' ? 1.0 : 0.8,
  }));
}
