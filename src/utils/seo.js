/**
 * SEO utilities for generating meta tags and structured data
 */

/**
 * Generate product meta tags object for Next.js metadata export
 */
export const generateProductMetaTags = (product) => {
  if (!product) return {};

  const title = `${product.name} | Student Marketplace`;
  const description =
    product.description?.substring(0, 160) ||
    `Buy ${product.name} from our student marketplace. Price: ₦${product.price?.toLocaleString()}`;

  const imageUrl = product.images?.[0]
    ? product.images[0].startsWith('http')
      ? product.images[0]
      : `http://localhost:5000${product.images[0]}`
    : `http://localhost:5000/placeholder.png`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'product',
      url: `https://student-marketplace.com/products/${product._id}`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
};

/**
 * Generate Product schema.org JSON-LD structured data
 */
export const generateProductSchema = (product, shop) => {
  return {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images || [],
    brand: {
      '@type': 'Brand',
      name: shop?.name || 'Student Marketplace',
    },
    seller: {
      '@type': 'Organization',
      name: shop?.name || 'Student Marketplace',
      url: `https://student-marketplace.com/shops/${shop?._id}`,
    },
    offers: {
      '@type': 'Offer',
      url: `https://student-marketplace.com/products/${product._id}`,
      priceCurrency: 'NGN',
      price: product.price?.toString(),
      availability:
        product.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      inventoryLevel: {
        '@type': 'QuantitativeValue',
        value: product.stock,
      },
    },
    aggregateRating: product.ratingsAverage
      ? {
          '@type': 'AggregateRating',
          ratingValue: product.ratingsAverage?.toString(),
          ratingCount: product.ratingsQuantity?.toString() || '0',
        }
      : undefined,
    category: product.category?.name || 'Uncategorized',
  };
};

/**
 * Generate Shop schema.org JSON-LD structured data
 */
export const generateShopSchema = (shop) => {
  return {
    '@context': 'https://schema.org/',
    '@type': 'LocalBusiness',
    name: shop.name,
    description: shop.description,
    image: shop.logo,
    url: `https://student-marketplace.com/shops/${shop._id}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: shop.campus?.name || 'On Campus',
    },
    aggregateRating: shop.rating
      ? {
          '@type': 'AggregateRating',
          ratingValue: shop.rating?.toString(),
          ratingCount: (shop.reviewCount || 0)?.toString(),
        }
      : undefined,
    telephone: shop.whatsappNumber,
  };
};

/**
 * Generate Organization schema.org JSON-LD structured data (for homepage)
 */
export const generateOrganizationSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Student Marketplace',
    description: 'A peer-to-peer marketplace for students',
    url: 'https://student-marketplace.com',
    logo: 'https://student-marketplace.com/logo.png',
    sameAs: [
      'https://facebook.com/studentmarketplace',
      'https://twitter.com/studentmarketplace',
      'https://instagram.com/studentmarketplace',
    ],
  };
};

/**
 * Generate BreadcrumbList schema.org JSON-LD
 */
export const generateBreadcrumbSchema = (items) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
};

/**
 * Helper to render JSON-LD script tag
 */
export const renderJsonLd = (schema) => {
  return JSON.stringify(schema);
};
