import { 
  useQuery, 
  useMutation, 
  useQueryClient,
  useInfiniteQuery 
} from '@tanstack/react-query';
import { getPosts, createPhotoPost, createVideoPost, createAudioPost, createTextPost, getPostById } from '@/lib/services/postService';
import { 
  Post, 
  PostQueryParams, 
  CreatePostRequest,
  PostsResponse 
} from '@/lib/types/post.types';
import { devLog, LogCategory } from '@/config/dev';

// Query Keys
const QUERY_KEYS = {
  posts: (params?: PostQueryParams) => ['posts', params],
  post: (id: string) => ['post', id],
} as const;

/**
 * Hook for fetching posts with pagination
 */
export const usePostsQuery = (params?: PostQueryParams) => {
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.posts(params),
    queryFn: async ({ pageParam = 1 }) => {
      devLog.api('Fetching posts page', { page: pageParam, params });
      const response = await getPosts({ pageParam, limit: params?.limit || 10 });
      // getPosts returns the data array directly, not wrapped in .data
      return {
        posts: response || [],
        hasNextPage: false, // API doesn't seem to provide pagination info
        nextPage: undefined,
        total: response?.length || 0
      };
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.nextPage : undefined;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

/**
 * Hook for fetching a single post
 */
export const usePostQuery = (postId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.post(postId),
    queryFn: () => getPostById(postId),
    enabled: !!postId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook for creating a new post
 */
export const useCreatePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postData: CreatePostRequest) => {
      devLog.api('Creating new post', { type: postData.type, hasFile: !!postData.file });
      
      switch (postData.type) {
        case 'photo':
          return createPhotoPost(postData);
        case 'video':
          return createVideoPost(postData);
        case 'audio':
          return createAudioPost(postData);
        case 'text':
          return createTextPost(postData);
        default:
          throw new Error(`Unsupported post type: ${postData.type}`);
      }
    },
    onSuccess: (response, variables) => {
      devLog.info(LogCategory.GENERAL, 'Post created successfully', { postId: response.post?._id });
      
      // Invalidate and refetch posts queries
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      
      // Optimistically add the new post to existing queries
      if (response.post) {
        queryClient.setQueryData<Post>(
          QUERY_KEYS.post(response.post._id),
          response.post
        );
      }
    },
    onError: (error) => {
      devLog.error(LogCategory.ERROR, 'Failed to create post', error);
    },
  });
};

/**
 * Utility hook to get all posts from infinite query
 */
export const useAllPosts = (params?: PostQueryParams): Post[] => {
  const { data } = usePostsQuery(params);
  
  console.log('useAllPosts data:', data);
  console.log('data.pages:', data?.pages);
  if (data?.pages?.[0]) {
    console.log('First page:', data.pages[0]);
    console.log('First page posts:', data.pages[0].posts);
  }
  
  return data?.pages.flatMap(page => page.posts) ?? [];
};

/**
 * Transform Post to the format expected by Double component
 * Keeps the existing interface for backwards compatibility
 */
export const transformPostToProject = (post: any) => {
  return {
    src: post?.thumbnail || post?.mediaUrl || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=500&fit=crop',
    videoUrl: post?.type === 'video' ? post?.mediaUrl : undefined,
    audioUrl: post?.type === 'audio' ? post?.mediaUrl : undefined,
    type: post?.type,
    name: post?.authorName,
    caption: post?.caption,
    date: post?.createdAt ? formatDate(post.createdAt) : 'Unknown',
    content: post?.content,
    _id: post?._id
  };
};

// Helper function to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else if (diffInHours < 48) {
    return '1 day ago';
  } else if (diffInHours < 168) {
    return `${Math.floor(diffInHours / 24)} days ago`;
  } else if (diffInHours < 336) {
    return '1 week ago';
  } else {
    return `${Math.floor(diffInHours / 168)} weeks ago`;
  }
};