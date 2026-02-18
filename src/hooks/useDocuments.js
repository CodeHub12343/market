import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import * as documentService from '@/services/documents';

const DOCUMENTS_QUERY_KEY = 'documents';
const DOCUMENTS_STALE_TIME = 30 * 1000; // 30 seconds

/**
 * Fetch all documents with automatic campus filtering
 * By default, only shows documents from user's campus
 * Can optionally show all campuses with allCampuses flag
 */
export const useDocuments = (filters = {}, enabled = true) => {
  const { user } = useAuth();

  // Auto-add campus filtering
  const enhancedFilters = {
    ...filters,
    // Campus filtering is enforced by backend for authenticated users
  };

  return useQuery({
    queryKey: [DOCUMENTS_QUERY_KEY, enhancedFilters],
    queryFn: () => documentService.fetchDocuments(enhancedFilters),
    staleTime: 0, // Always fetch fresh data
    gcTime: 0, // Don't cache
    enabled: enabled && !!user, // Only fetch if authenticated
  });
};

/**
 * Fetch single document by ID
 */
export const useDocument = (id, enabled = true) => {
  return useQuery({
    queryKey: [DOCUMENTS_QUERY_KEY, id],
    queryFn: () => documentService.fetchDocumentById(id),
    staleTime: DOCUMENTS_STALE_TIME,
    enabled: enabled && !!id,
  });
};

/**
 * Create a new document
 */
export const useCreateDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData) => documentService.createDocument(formData),
    onSuccess: (newDocument) => {
      console.log('✅ Document created:', newDocument);
      // Invalidate documents list to force refresh
      queryClient.invalidateQueries({
        queryKey: [DOCUMENTS_QUERY_KEY],
        exact: false,
      });
    },
    onError: (error) => {
      console.error('❌ Failed to create document:', error);
    },
  });
};

/**
 * Update document
 */
export const useUpdateDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }) => documentService.updateDocument(id, updates),
    onSuccess: (updatedDocument, variables) => {
      console.log('✅ Document updated');
      // Update cache immediately
      queryClient.setQueryData([DOCUMENTS_QUERY_KEY, variables.id], updatedDocument);
      // Invalidate list to refresh
      queryClient.invalidateQueries({
        queryKey: [DOCUMENTS_QUERY_KEY],
        exact: false,
      });
    },
  });
};

/**
 * Delete document
 */
export const useDeleteDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => documentService.deleteDocument(id),
    onSuccess: (_, deletedId) => {
      console.log('✅ Document deleted');
      // Remove from cache
      queryClient.removeQueries({
        queryKey: [DOCUMENTS_QUERY_KEY, deletedId],
      });
      // Invalidate list
      queryClient.invalidateQueries({
        queryKey: [DOCUMENTS_QUERY_KEY],
        exact: false,
      });
    },
  });
};

/**
 * Search documents
 */
export const useSearchDocuments = (query, filters = {}, enabled = true) => {
  return useQuery({
    queryKey: [DOCUMENTS_QUERY_KEY, 'search', query, filters],
    queryFn: () => documentService.searchDocuments(query, filters),
    staleTime: DOCUMENTS_STALE_TIME,
    enabled: enabled && !!query,
  });
};

/**
 * Get trending documents
 */
export const useTrendingDocuments = (limit = 10, enabled = true) => {
  return useQuery({
    queryKey: [DOCUMENTS_QUERY_KEY, 'trending', limit],
    queryFn: () => documentService.getTrendingDocuments(limit),
    staleTime: DOCUMENTS_STALE_TIME * 2, // Less frequent updates
    enabled,
  });
};

/**
 * Download document (increment counter)
 */
export const useDownloadDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => documentService.downloadDocument(id),
    onSuccess: (downloadUrl, documentId) => {
      console.log('✅ Document download started');
      // Refetch the document to update download count
      queryClient.invalidateQueries({
        queryKey: [DOCUMENTS_QUERY_KEY, documentId],
      });
    },
  });
};

/**
 * Rate document
 */
export const useRateDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, rating }) => documentService.rateDocument(id, rating),
    onSuccess: (updatedDocument, variables) => {
      console.log('✅ Document rated');
      // Update cache
      queryClient.setQueryData([DOCUMENTS_QUERY_KEY, variables.id], updatedDocument);
    },
  });
};

/**
 * Add comment to document
 */
export const useCommentDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, comment }) => documentService.commentDocument(id, comment),
    onSuccess: (newComment, variables) => {
      console.log('✅ Comment added');
      // Refetch document to get updated comments
      queryClient.invalidateQueries({
        queryKey: [DOCUMENTS_QUERY_KEY, variables.id],
      });
    },
  });
};

export default {
  useDocuments,
  useDocument,
  useCreateDocument,
  useUpdateDocument,
  useDeleteDocument,
  useSearchDocuments,
  useTrendingDocuments,
  useDownloadDocument,
  useRateDocument,
  useCommentDocument,
};
