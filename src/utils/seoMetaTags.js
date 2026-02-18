/**
 * ✅ SEO Meta Tags Utility
 * Client-side meta tag management for dynamic pages
 */

export function setMetaTags({
  title = 'University Marketplace',
  description = 'Buy, sell, and discover services on campus. Safe, trusted transactions.',
  image = '/og-default.png',
  url = '',
  type = 'website',
  twitterHandle = '@universitymarketplace',
} = {}) {
  // Guard against server-side execution
  if (typeof window === 'undefined') return;

  try {
    // ✅ Set page title
    document.title = title;

    // ✅ Helper function to create/update meta tags
    const updateMeta = (name, content, isProperty = false) => {
      if (!content) return; // Skip empty values

      const selector = isProperty
        ? `meta[property="${name}"]`
        : `meta[name="${name}"]`;

      let tag = document.querySelector(selector);

      if (!tag) {
        tag = document.createElement('meta');
        if (isProperty) {
          tag.setAttribute('property', name);
        } else {
          tag.setAttribute('name', name);
        }
        document.head.appendChild(tag);
      }

      tag.setAttribute('content', content);
    };

    // ✅ Standard meta tags
    updateMeta('description', description);
    updateMeta('viewport', 'width=device-width, initial-scale=1');
    updateMeta('robots', 'index, follow');
    updateMeta('charset', 'utf-8');

    // ✅ Open Graph tags (for social sharing)
    updateMeta('og:title', title, true);
    updateMeta('og:description', description, true);
    updateMeta('og:image', image, true);
    updateMeta('og:type', type, true);
    if (url) updateMeta('og:url', url, true);
    updateMeta('og:site_name', 'University Marketplace', true);

    // ✅ Twitter Card tags
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', title);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', image);
    updateMeta('twitter:creator', twitterHandle);

    // ✅ Additional SEO tags
    updateMeta('theme-color', '#000000');
    updateMeta('mobile-web-app-capable', 'yes');
    updateMeta('apple-mobile-web-app-capable', 'yes');
    updateMeta('apple-mobile-web-app-status-bar-style', 'black-translucent');

    // ✅ Update canonical URL (prevent duplicate content)
    if (url) {
      let canonical = document.querySelector("link[rel='canonical']");
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', url);
    }
  } catch (error) {
    console.error('Error setting meta tags:', error);
  }
}

/**
 * ✅ Add JSON-LD Structured Data
 * Returns a cleanup function to remove the script on unmount
 */
export function addStructuredData(schemaData) {
  if (typeof window === 'undefined' || !schemaData) return () => {};

  try {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify(schemaData);
    document.head.appendChild(script);

    // Return cleanup function
    return () => {
      try {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      } catch (e) {
        // Already removed
      }
    };
  } catch (error) {
    console.error('Error adding structured data:', error);
    return () => {};
  }
}

/**
 * ✅ Generate Product Meta Tags
 */
export function generateProductMeta(product, shopId) {
  if (!product) return {};

  const title = `${product.productName || product.title} | ₦${Number(
    product.price || 0
  ).toLocaleString()} | University Marketplace`;

  const description = `${product.productName || product.title} - ${
    product.description?.substring(0, 80) || 'Quality product'
  }. Seller: ${product.seller?.fullName || 'Campus Seller'}. Available on University Marketplace.`;

  const image = product.images?.[0]
    ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${product.images[0]}`
    : '/og-product.png';

  const url = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/shops/${shopId}/products/${product._id}`;

  return {
    title,
    description: description.substring(0, 160),
    image,
    url,
    type: 'product',
  };
}

/**
 * ✅ Generate Service Meta Tags
 */
export function generateServiceMeta(service) {
  if (!service) return {};

  const title = `${service.serviceName || service.title} | ₦${Number(
    service.price || 0
  ).toLocaleString()}/${service.durationUnit || 'month'} | Book`;

  const description = `Professional ${service.serviceCategory || 'service'}. ${
    service.description?.substring(0, 90) || 'High-quality service'
  }. Provider: ${service.user?.fullName || 'Service Provider'}. Book on University Marketplace.`;

  const image = service.images?.[0]
    ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${service.images[0]}`
    : '/og-service.png';

  const url = `${
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  }/services/${service._id}`;

  return {
    title: title.substring(0, 60),
    description: description.substring(0, 160),
    image,
    url,
    type: 'business.business',
  };
}

/**
 * ✅ Generate Roommate Meta Tags
 */
export function generateRoommateMeta(roommate) {
  if (!roommate) return {};

  const title = `${roommate.fullName || roommate.name} | ₦${Number(
    roommate.price || 0
  ).toLocaleString()}/month | University Marketplace`;

  const description = `${roommate.gender} roommate at ${
    roommate.location || 'Campus'
  }. ${roommate.bio?.substring(0, 80) || 'Find your perfect roommate'}. Available on University Marketplace.`;

  const image = roommate.profilePicture
    ? roommate.profilePicture.startsWith('http')
      ? roommate.profilePicture
      : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${
          roommate.profilePicture
        }`
    : '/og-roommate.png';

  const url = `${
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  }/roommates/${roommate._id}`;

  return {
    title: title.substring(0, 60),
    description: description.substring(0, 160),
    image,
    url,
    type: 'place',
  };
}

/**
 * ✅ Generate Shop Meta Tags
 */
export function generateShopMeta(shop) {
  if (!shop) return {};

  const title = `${shop.shopName || shop.name} | Shop | University Marketplace`;

  const description = `${shop.description?.substring(0, 100) || 'Quality products available'}. Shop by ${
    shop.seller?.fullName || 'campus seller'
  }. Safe transactions on University Marketplace.`;

  const image = shop.logo || '/og-shop.png';

  const url = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/shops/${
    shop._id
  }`;

  return {
    title: title.substring(0, 60),
    description: description.substring(0, 160),
    image,
    url,
    type: 'business',
  };
}

/**
 * ✅ Generate Product Schema
 */
export function generateProductSchema(product, shopId) {
  if (!product) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.productName || product.title,
    description: product.description,
    image: product.images?.map((img) =>
      img.startsWith('http')
        ? img
        : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${img}`
    ),
    sku: product._id,
    brand: {
      '@type': 'Brand',
      name: 'University Marketplace',
    },
    offers: {
      '@type': 'Offer',
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/shops/${shopId}/products/${product._id}`,
      priceCurrency: 'NGN',
      price: product.price,
      availability:
        product.status === 'available' || product.inStock
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: product.seller?.fullName || 'Campus Seller',
      },
    },
    ...(product.ratings?.length > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: (
          product.ratings.reduce((a, b) => a + (b.rating || 0), 0) /
          product.ratings.length
        ).toFixed(1),
        bestRating: 5,
        worstRating: 1,
        ratingCount: product.ratings.length,
      },
    }),
  };
}

/**
 * ✅ Generate Service Schema
 */
export function generateServiceSchema(service) {
  if (!service) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.serviceName || service.title,
    description: service.description,
    image: service.images?.map((img) =>
      img.startsWith('http')
        ? img
        : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${img}`
    ),
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
    ...(service.reviews?.length > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: (
          service.reviews.reduce((a, b) => a + (b.rating || 0), 0) /
          service.reviews.length
        ).toFixed(1),
        bestRating: 5,
        worstRating: 1,
        ratingCount: service.reviews.length,
      },
    }),
    offers: {
      '@type': 'Offer',
      priceCurrency: 'NGN',
      price: service.price,
      availability:
        service.available === true
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
    },
  };
}

/**
 * ✅ Generate Roommate Schema
 */
export function generateRoommateSchema(roommate) {
  if (!roommate) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: roommate.fullName || roommate.name,
    description: roommate.bio,
    image: roommate.profilePicture
      ? roommate.profilePicture.startsWith('http')
        ? roommate.profilePicture
        : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${
            roommate.profilePicture
          }`
      : undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: roommate.location,
      addressCountry: 'NG',
    },
    ...(roommate.reviews?.length > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: (
          roommate.reviews.reduce((a, b) => a + (b.rating || 0), 0) /
          roommate.reviews.length
        ).toFixed(1),
        bestRating: 5,
        worstRating: 1,
        ratingCount: roommate.reviews.length,
      },
    }),
    priceRange: `₦${(roommate.price || 0).toLocaleString()}/month`,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      telephone: roommate.phone || '',
    },
  };
}

/**
 * ✅ Generate Breadcrumb Schema
 */
export function generateBreadcrumbSchema(items) {
  if (!items || items.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}${
        item.url
      }`,
    })),
  };
}
