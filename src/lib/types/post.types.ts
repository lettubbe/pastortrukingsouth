export interface Post {
  _id: string;
  type: 'video' | 'photo' | 'audio' | 'text';
  content?: string; // For text posts
  mediaUrl?: string; // For video, image, audio posts
  thumbnail?: string; // For video posts
  caption: string;
  authorName: string; // Anonymous display name
  createdAt: string;
  moderationStatus: 'pending' | 'approved' | 'rejected';
}

export interface CreatePostRequest {
  type: 'video' | 'photo' | 'audio' | 'text';
  content?: string;
  caption: string;
  authorName: string;
  file?: File;
}

export interface CreatePostResponse {
  success: boolean;
  message: string;
  post?: Post;
}

export interface PostsResponse {
  success: boolean;
  posts: Post[];
  hasNextPage: boolean;
  nextPage?: number;
  total: number;
}

export interface PostQueryParams {
  page?: number;
  limit?: number;
  type?: 'video' | 'photo' | 'audio' | 'text';
  sortBy?: 'newest' | 'popular' | 'trending';
}

