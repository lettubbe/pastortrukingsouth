import { getInstance } from "@/config";
import { devLog, LogCategory } from "@/config/dev";
import { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

// Define the HTTP methods we support
type HttpMethod = "get" | "post" | "put" | "delete" | "patch";

// Type for successful response
interface ApiResponse<T> {
	data: T;
	status: number;
	statusText: string;
}

// Type for error response
interface ApiError {
	message: string;
	status: number;
	data?: any;
}

/**
 * Makes an API request with proper typing
 * @param method - HTTP method (get, post, put, delete, patch)
 * @param url - API endpoint
 * @param data - Request payload (for POST, PUT, PATCH)
 * @param config - Additional axios config
 * @returns Promise with response data of type T
 */
export const makeRequest = async <TResponse = any, TRequest = any>(
	method: HttpMethod,
	url: string,
	data?: TRequest,
	config?: Omit<AxiosRequestConfig, "url" | "method" | "data">
): Promise<TResponse> => {
	try {
		const axiosInstance: AxiosInstance = await getInstance();

		let response: AxiosResponse;

		// Handle different HTTP methods appropriately
		if (method === "get" || method === "delete") {
			// For GET and DELETE, data should be passed as params
			response = await axiosInstance[method](url, {
				params: data,
				...config,
			});
		} else {
			// For POST, PUT, PATCH, data goes in the request body
			response = await axiosInstance[method](url, data, config);
		}

		return response.data;
	} catch (error) {
		if (error instanceof AxiosError) {
			const apiError: ApiError = {
				message: error.message,
				status: error.response?.status || 0,
				data: error.response?.data,
			};

			devLog.error(LogCategory.API_REQUESTS, `${method.toUpperCase()} request failed: ${url}`, apiError);
			throw apiError;
		}

		devLog.error(LogCategory.ERROR, `Unexpected error in ${method.toUpperCase()} request: ${url}`, error);
		throw error;
	}
};

/**
 * Convenience methods for common HTTP verbs
 */
export const apiClient = {
	get: <TResponse = any, TParams = any>(url: string, params?: TParams, config?: AxiosRequestConfig) =>
		makeRequest<TResponse, TParams>("get", url, params, config),

	post: <TResponse = any, TRequest = any>(url: string, data?: TRequest, config?: AxiosRequestConfig) =>
		makeRequest<TResponse, TRequest>("post", url, data, config),

	put: <TResponse = any, TRequest = any>(url: string, data?: TRequest, config?: AxiosRequestConfig) =>
		makeRequest<TResponse, TRequest>("put", url, data, config),

	patch: <TResponse = any, TRequest = any>(url: string, data?: TRequest, config?: AxiosRequestConfig) =>
		makeRequest<TResponse, TRequest>("patch", url, data, config),

	delete: <TResponse = any, TParams = any>(url: string, params?: TParams, config?: AxiosRequestConfig) =>
		makeRequest<TResponse, TParams>("delete", url, params, config),
};
