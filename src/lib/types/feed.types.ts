export interface UserInfo {
  _id: string;
  username: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  profilePicture: string;
  isVerified?: boolean;
  country?: string;
  followers?: number;
  isSubscribed?: boolean;
}

export interface PostReaction {
  scrollViews: number;
  likes: string[];
  dislikes: string[];
  shares: number;
  views: number;
  totalLikes?: number;
  totalDislikes?: number;
  isLikedByCurrentUser?: boolean;
  isDislikedByCurrentUser?: boolean;
}

export interface PostComment {
  _id: string;
  text: string;
  user: UserInfo;
  createdAt: string;
  likes: number;
  replies?: PostComment[];
}

export interface FeedPost {
  scrollViews: number;
  _id: string;
  thumbnail: string | null;
  videoUrl?: string | null;
  images?: string[];
  description: string;
  user: UserInfo;
  reactions: PostReaction;
  comments: PostComment[];
  commentCount: number;
  duration?: number | null;
  createdAt: string;
  isCommentsAllowed: boolean;
  views?: number;
  isBookmarked?: boolean;
  category?: string;
  tags?: string[];
  visibility: string;
  mentions?: any[];
}

export interface FeedResponse {
  posts: FeedPost[];
  hasNextPage: boolean;
  nextPage?: number;
}