import { apiClient } from "@/lib/request";
import { GenericResponse } from "@/lib/types/general.types";
import { CreatePostRequest, CreatePostResponse } from "@/lib/types/post.types";
import { generateVideoThumbnail, generateImageThumbnail } from "@/lib/thumbnailGenerator";

// Get all posts
export const getPosts = async ({ pageParam = 1, limit = 10 }) => {
    const response = await apiClient.get(`/resources?page=${pageParam}&limit=${limit}`);
    return response.data;
};

// Create photo post
export const createPhotoPost = async (postData: any): Promise<GenericResponse> => {
    const formData = new FormData();
    
    if (postData.file) {
        formData.append('photo', postData.file);
        
        // Generate and add thumbnail
        try {
            const thumbnail = await generateImageThumbnail(postData.file);
            formData.append('thumbnail', thumbnail);
        } catch (error) {
            console.warn('Failed to generate photo thumbnail:', error);
        }
    }
    formData.append('caption', postData.caption);
    formData.append('authorName', postData.authorName);
    if (postData.content) {
        formData.append('content', postData.content);
    }

    return await apiClient.post(`/resources/resource/photos`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

// Create video post
export const createVideoPost = async (postData: any): Promise<GenericResponse> => {
    const formData = new FormData();
    
    if (postData.file) {
        formData.append('video', postData.file);
        
        // Generate and add thumbnail from first frame
        try {
            const thumbnail = await generateVideoThumbnail(postData.file);
            formData.append('thumbnail', thumbnail);
        } catch (error) {
            console.warn('Failed to generate video thumbnail:', error);
        }
    }
    formData.append('caption', postData.caption);
    formData.append('authorName', postData.authorName);
    if (postData.content) {
        formData.append('content', postData.content);
    }

    return await apiClient.post(`/resources/resource/video`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

// Create audio post
export const createAudioPost = async (postData: any): Promise<GenericResponse> => {
    const formData = new FormData();
    
    if (postData.file) {
        formData.append('audio', postData.file);
    }
    formData.append('caption', postData.caption);
    formData.append('authorName', postData.authorName);
    if (postData.content) {
        formData.append('content', postData.content);
    }

    return await apiClient.post(`/resources/resource/audio`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

// Create text post
export const createTextPost = async (postData: any): Promise<GenericResponse> => {
    return await apiClient.post(`/resources/resource/text`, {
        caption: postData.caption,
        authorName: postData.authorName,
        content: postData.content,
    });
};

// Get single post by ID
export const getPostById = async (postId: string) => {
    const response = await apiClient.get(`/resources/${postId}`);
    return response.data;
};

// Generic create post function that routes to the appropriate function
export const createPost = async (postData: CreatePostRequest): Promise<CreatePostResponse> => {
    switch (postData.type) {
        case 'photo':
            return await createPhotoPost(postData);
        case 'video':
            return await createVideoPost(postData);
        case 'audio':
            return await createAudioPost(postData);
        case 'text':
            return await createTextPost(postData);
        default:
            throw new Error(`Unsupported post type: ${postData.type}`);
    }
};