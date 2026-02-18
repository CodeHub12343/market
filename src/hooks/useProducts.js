import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import * as productService from '@/services/products';

// Helper function to serialize filters to stable JSON string
const getFiltersKey = (filters = {}) => {
  return JSON.stringify(filters || {});
};

/**
 * Hook for fetching all products with automatic campus filtering
 * By default, only shows products from user's campus
 * Can optionally show all campuses with allCampuses flag
 */
export const useAllProducts = (page = 1, limit = 12, filters = {}) => {
  const { user } = useAuth();

  // Auto-add campus filtering to request
  const enhancedFilters = {
    ...filters,
    // Backend will handle campus filtering based on user's JWT
    // Frontend can pass allCampuses=true to see all campuses
  };

  return useQuery({
    queryKey: ['allProducts', page, limit, getFiltersKey(enhancedFilters)],
    queryFn: async () => {
      try {
        const params = { page, limit, ...enhancedFilters };
        console.log("useAllProducts - Calling fetchProducts with params:", params);
        
        const result = await productService.fetchProducts(params);
        console.log("useAllProducts result:", result);
        return result;
      } catch (err) {
        console.error("useAllProducts error:", err);
        throw err;
      }
    },
    keepPreviousData: true,
    enabled: !!user, // Only fetch if user is authenticated
  });
};

/**
 * Hook for fetching all products with pagination
 * Automatically applies campus filtering based on user's campus
 */
export const useProducts = (page = 1, limit = 12, filters = {}) => {
  const { user } = useAuth();

  // Auto-add campus filtering
  const enhancedFilters = {
    ...filters,
    // Campus filtering is enforced by backend for authenticated users
  };

  return useQuery({
    queryKey: ['products', page, limit, getFiltersKey(enhancedFilters)],
    queryFn: async () => {
      try {
        const result = await productService.fetchProductsPaginated(page, limit, enhancedFilters);
        console.log("useProducts result:", result);
        return result;
      } catch (err) {
        console.error("useProducts error:", err);
        throw err;
      }
    },
    keepPreviousData: true,
    enabled: !!user, // Only fetch if authenticated
  });
};

/**
 * Hook for fetching product by ID
 */
export const useProductById = (id, enabled = true) => {
  return useQuery({
    queryKey: ['products', id],
    queryFn: async () => {
      const result = await productService.fetchProductById(id);
      console.log("useProductById result:", result);
      return result;
    },
    enabled: !!id && enabled,
  });
};

/**
 * Hook for fetching user's products
 */
export const useMyProducts = (params = {}) => {
  return useQuery({
    queryKey: ['myProducts', getFiltersKey(params)],
    queryFn: () => productService.fetchMyProducts(params),
  });
};

/**
 * Hook for creating product
 */
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productData, images }) =>
      productService.createProduct(productData, images),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['allProducts'] });
      queryClient.invalidateQueries({ queryKey: ['myProducts'] });
    },
  });
};

/**
 * Hook for updating product
 */
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, productData, images }) =>
      productService.updateProduct(id, productData, images),
    // Use variables param to reliably target the updated product cache
    onSuccess: (data, variables) => {
      // Invalidate all product lists so they refetch with updated data
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['allProducts'] });
      queryClient.invalidateQueries({ queryKey: ['myProducts'] });

      // Prefer the id from variables (passed when mutating) to update the single-product cache
      const productId = variables?.id || data?._id || data?.id;

      if (productId) {
        // Update the product-by-id cache immediately with returned data
        try {
          queryClient.setQueryData(['products', productId], data);
        } catch (e) {
          // ignore set cache errors
        }

        // Also invalidate the specific product query to ensure fresh data if backend shape differs
        queryClient.invalidateQueries({ queryKey: ['products', productId] });
      }
    },
  });
};

/**
 * Hook for deleting product
 */
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => productService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['myProducts'] });
    },
  });
};

/**
 * Hook for searching products
 */
export const useSearchProducts = (query, filters = {}) => {
  return useQuery({
    queryKey: ['searchProducts', query, getFiltersKey(filters)],
    queryFn: () => productService.searchProducts(query, filters),
    enabled: !!query,
  });
};

/**
 * Hook for product stats
 */
export const useProductStats = () => {
  return useQuery({
    queryKey: ['productStats'],
    queryFn: productService.getProductStats,
  });
};