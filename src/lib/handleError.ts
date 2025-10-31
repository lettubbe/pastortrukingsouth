import showToast from "./showToast";
import { devLog, LogCategory } from "@/config/dev";

interface ApiErrorResponse {
	response?: {
		data?: {
			error?: string;
		};
	};
	message?: string;
}

export const handleGetError = (error: unknown): string => {
	if (!error || typeof error !== 'object') {
		return "Something went wrong";
	}
	
	const apiError = error as ApiErrorResponse;
	
	if (!apiError.response) {
		return apiError.message || "Something went wrong";
	} else if (apiError.response.data?.error) {
		return apiError.response.data.error;
	} else {
		return "Something went wrong";
	}
};

export const handleError = (error: unknown) => {
	devLog.error(LogCategory.ERROR, "Application error", error);
	
	let userMessage = "Something went wrong. Please try again.";
	
	if (error && typeof error === 'object' && 'status' in error) {
		const apiError = error as { status: number; message?: string; data?: { error?: string } };
		
		if (apiError.status === 404) {
			userMessage = "Service not found. Please try again later.";
		} else if (apiError.status === 500) {
			userMessage = "Server error. Please try again in a few minutes.";
		} else if (apiError.status === 503) {
			userMessage = "Service temporarily unavailable. Please try again later.";
		} else if (apiError.message?.includes('timeout')) {
			userMessage = "Request timed out. Please check your connection.";
		} else if (apiError.message?.includes('Network Error')) {
			userMessage = "Network error. Please check your internet connection.";
		} else if (apiError.data?.error) {
			const serverMessage = apiError.data.error;
			if (serverMessage.length < 100 && !serverMessage.includes('stack') && !serverMessage.includes('Error:')) {
				userMessage = serverMessage;
			}
		}
	}
	
	showToast("error", userMessage);
};

export const handleErrorMessage = (error: string) => {
	devLog.error(LogCategory.ERROR, "Error message", error);
	if (error) {
		showToast("error", error);
	}
};
