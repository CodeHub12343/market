import dynamic from 'next/dynamic';

// Skeleton components placeholders
const ChatListSkeleton = () => <div style={{ height: '300px', background: '#f0f0f0', borderRadius: '8px' }} />;
const RecommendationSkeleton = () => <div style={{ height: '250px', background: '#f0f0f0', borderRadius: '8px' }} />;
const SearchSkeleton = () => <div style={{ height: '400px', background: '#f0f0f0', borderRadius: '8px' }} />;
const FormSkeleton = () => <div style={{ height: '350px', background: '#f0f0f0', borderRadius: '8px' }} />;

// ✅ Lazy-load heavy components with loading states
export const DynamicChatList = dynamic(
  () => import('@/components/chat/ChatList').catch(() => ({ default: () => <div>Chat unavailable</div> })),
  {
    loading: () => <ChatListSkeleton />,
    ssr: false,
  }
);

export const DynamicServiceRecommendations = dynamic(
  () => import('@/components/services/PersonalizedServiceRecommendations').catch(() => ({ default: () => <div>Recommendations unavailable</div> })),
  {
    loading: () => <RecommendationSkeleton />,
    ssr: false,
  }
);

export const DynamicAdvancedSearch = dynamic(
  () => import('@/components/services/AdvancedServiceSearchModal').catch(() => ({ default: () => <div>Search unavailable</div> })),
  {
    loading: () => <SearchSkeleton />,
    ssr: false,
  }
);

export const DynamicReviewForm = dynamic(
  () => import('@/components/services/ReviewForm').catch(() => ({ default: () => <div>Review form unavailable</div> })),
  {
    loading: () => <FormSkeleton />,
    ssr: false,
  }
);

// Usage:
// import { DynamicChatList } from '@/lib/dynamic-imports';
// <DynamicChatList /> // Only loads when needed
