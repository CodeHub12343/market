/**
 * ✅ JSON-LD Schema Generator Component
 * Generates structured data for Google rich snippets
 */

export function ProductSchema({ product }) {
  if (!product) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${process.env.NEXT_PUBLIC_SITE_URL}/shops/${product.shopId}/products/${product._id}`,
    name: product.productName || product.title,
    description: product.description,
    image: product.images?.map((img) => {
      if (img.startsWith('http')) return img;
      return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${img}`;
    }) || [],
    sku: product._id,
    brand: {
      '@type': 'Brand',
      name: 'University Marketplace',
    },
    offers: {
      '@type': 'Offer',
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/shops/${product.shopId}/products/${product._id}`,
      priceCurrency: 'NGN',
      price: product.price,
      availability: product.status === 'available' || product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: product.seller?.fullName || 'Campus Seller',
      },
    },
    aggregateRating: product.ratings?.length > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: (product.ratings.reduce((a, b) => a + b.rating, 0) / product.ratings.length).toFixed(1),
      bestRating: 5,
      worstRating: 1,
      ratingCount: product.ratings.length,
    } : undefined,
    category: product.category || 'Product',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ServiceSchema({ service }) {
  if (!service) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${process.env.NEXT_PUBLIC_SITE_URL}/services/${service._id}`,
    name: service.serviceName || service.title,
    description: service.description,
    image: service.images?.map((img) => {
      if (img.startsWith('http')) return img;
      return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${img}`;
    }) || [],
    serviceType: service.serviceCategory,
    provider: {
      '@type': 'Person',
      name: service.user?.fullName || 'Service Provider',
    },
    areaServed: {
      '@type': 'City',
      name: service.location || 'On-site',
    },
    priceRange: `₦${service.price}/${service.durationUnit}`,
    aggregateRating: service.reviews?.length > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: (service.reviews.reduce((a, b) => a + b.rating, 0) / service.reviews.length).toFixed(1),
      bestRating: 5,
      worstRating: 1,
      ratingCount: service.reviews.length,
    } : undefined,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'NGN',
      price: service.price,
      availability: service.available === true
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function RoommateSchema({ roommate }) {
  if (!roommate) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    '@id': `${process.env.NEXT_PUBLIC_SITE_URL}/roommates/${roommate._id}`,
    name: roommate.fullName || roommate.name,
    description: roommate.bio,
    image: roommate.profilePicture
      ? (roommate.profilePicture.startsWith('http')
          ? roommate.profilePicture
          : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${roommate.profilePicture}`)
      : undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: roommate.location,
      addressCountry: 'NG',
    },
    aggregateRating: roommate.reviews?.length > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: (roommate.reviews.reduce((a, b) => a + b.rating, 0) / roommate.reviews.length).toFixed(1),
      bestRating: 5,
      worstRating: 1,
      ratingCount: roommate.reviews.length,
    } : undefined,
    priceRange: `₦${(roommate.price || 0).toLocaleString()}/month`,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      telephone: roommate.phone || '',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbSchema({ items }) {
  if (!items || items.length === 0) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: `${process.env.NEXT_PUBLIC_SITE_URL}${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'University Marketplace',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    logo: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
    sameAs: [
      'https://www.facebook.com/universitymarketplace',
      'https://twitter.com/universitymarketplace',
      'https://www.instagram.com/universitymarketplace',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
