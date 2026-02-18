/**
 * ✅ SEO Helper Functions
 * Generate SEO-friendly titles and descriptions for all pages
 */

export const generateShopTitle = (shop) => {
  // Format: [Shop Name] | [Items Count] Products | University Marketplace
  // Length: 50-60 characters
  if (!shop) return 'Shop | University Marketplace';
  
  const title = `${shop.shopName || shop.name} | Shop | University Marketplace`;
  return title.length > 60 
    ? `${shop.shopName || shop.name} | University Marketplace` 
    : title;
};

export const generateShopDescription = (shop) => {
  // Format: [Description] - Browse [Count] products. Safe transactions on University Marketplace.
  // Length: 150-160 characters
  if (!shop) return 'Browse products on University Marketplace';
  
  const baseDesc = `${shop.description?.substring(0, 100) || 'Quality products available'}. Shop by ${shop.seller?.fullName || 'campus seller'}. Browse and buy safely on University Marketplace.`;
  return baseDesc.length > 160 
    ? `${shop.description?.substring(0, 80)}... on University Marketplace` 
    : baseDesc;
};

export const generateProductTitle = (product) => {
  // Format: [Product Name] | ₦[Price] | University Marketplace
  // Length: 50-60 characters
  if (!product) return 'Product | University Marketplace';
  
  const title = `${product.productName || product.title} | ₦${Number(product.price || 0).toLocaleString()} | University Marketplace`;
  return title.length > 60 
    ? `${product.productName || product.title} | ₦${Number(product.price || 0).toLocaleString()}` 
    : title;
};

export const generateProductDescription = (product) => {
  // Format: [Product Description] - Seller: [Name]. Available on University Marketplace.
  // Length: 150-160 characters
  if (!product) return 'Buy products on University Marketplace';
  
  const baseDesc = `${product.productName || product.title} for ₦${Number(product.price || 0).toLocaleString()}. ${product.description?.substring(0, 70) || 'Quality product'}. Seller: ${product.seller?.fullName || 'Campus Seller'}. Available on University Marketplace.`;
  return baseDesc.length > 160 
    ? `${product.productName || product.title} - ${product.description?.substring(0, 60)}... on University Marketplace` 
    : baseDesc;
};

export const generateServiceTitle = (service) => {
  // Format: [Service Name] | ₦[Price]/[Duration] | Book Now
  // Length: 50-60 characters
  if (!service) return 'Service | University Marketplace';
  
  const title = `${service.serviceName || service.title} | ₦${Number(service.price || 0).toLocaleString()}/${service.durationUnit || 'month'} | Book`;
  return title.length > 60 
    ? `${service.serviceName || service.title} | ₦${Number(service.price || 0).toLocaleString()}` 
    : title;
};

export const generateServiceDescription = (service) => {
  // Format: [Type] service by [Provider]. [Description]. Rating: [Rating]⭐
  // Length: 150-160 characters
  if (!service) return 'Book services on University Marketplace';
  
  const baseDesc = `Professional ${service.serviceCategory || 'service'}. ${service.description?.substring(0, 90) || 'High-quality service'}. Provider: ${service.user?.fullName || 'Service Provider'}. Book on University Marketplace.`;
  return baseDesc.length > 160 
    ? `${service.serviceCategory || 'Service'} - ${service.description?.substring(0, 70)}... on University Marketplace` 
    : baseDesc;
};

export const generateRoommateTitle = (roommate) => {
  // Format: [Roommate Name] | ₦[Price]/month | [Campus/Location]
  // Length: 50-60 characters
  if (!roommate) return 'Accommodation | University Marketplace';
  
  const title = `${roommate.fullName || roommate.name} | ₦${Number(roommate.price || 0).toLocaleString()}/month | University Marketplace`;
  return title.length > 60 
    ? `${roommate.fullName || roommate.name} | ₦${Number(roommate.price || 0).toLocaleString()}` 
    : title;
};

export const generateRoommateDescription = (roommate) => {
  // Format: [Gender] roommate at [Location]. [Description]. Budget: ₦[Price]/month
  // Length: 150-160 characters
  if (!roommate) return 'Find accommodation on University Marketplace';
  
  const baseDesc = `${roommate.gender} roommate available. ${roommate.bio?.substring(0, 90) || 'Friendly roommate'}. Location: ${roommate.location || 'Campus'}. Budget: ₦${Number(roommate.price || 0).toLocaleString()}/month on University Marketplace.`;
  return baseDesc.length > 160 
    ? `${roommate.gender} roommate - ${roommate.bio?.substring(0, 60)}... ₦${Number(roommate.price || 0).toLocaleString()}/month` 
    : baseDesc;
};

// Helper for alt text
export const generateAltText = (item, type = 'product') => {
  switch (type) {
    case 'product':
      return `${item.productName || item.title} - ${item.category || 'item'} | University Marketplace`;
    case 'service':
      return `${item.serviceName || item.title} service - ${item.serviceCategory || 'service'} | University Marketplace`;
    case 'roommate':
      return `${item.fullName || item.name} roommate - accommodation at ${item.location || 'campus'} | University Marketplace`;
    default:
      return 'University Marketplace';
  }
};
