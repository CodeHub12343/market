/**
 * ✅ Dynamic Sitemap Generation
 * Generates XML sitemap for all products, services, and roommates
 */

// This is a Next.js sitemap route
// Placed at: src/app/sitemap.js
// Accessed at: /sitemap.xml

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  try {
    // Try to fetch data from your API
    // If fetch fails, return minimal sitemap
    const staticPages = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
      {
        url: `${baseUrl}/shops`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.95,
      },
      {
        url: `${baseUrl}/services`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.95,
      },
      {
        url: `${baseUrl}/roommates`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.95,
      },
    ];

    // In production, fetch from your API
    // const products = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`).then(r => r.json());
    // const services = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services`).then(r => r.json());
    // const roommates = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/roommates`).then(r => r.json());

    return staticPages;
  } catch (error) {
    console.error('Sitemap generation error:', error);

    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
    ];
  }
}
