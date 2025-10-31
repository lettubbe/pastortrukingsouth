import { getData } from "@/lib/storage";
import axios from "axios";
import axiosRetry from "axios-retry";
import { devLog, LogCategory } from "./dev";

export const baseURL =  "https://api.trusouthking.com/api/v1/";

// Function to create an Axios instance with token
const createInstanceWithToken = async () => {
	try {
		const token = await getData("token");

		const headers: Record<string, string> = {};
		if (token) {
			headers.Authorization = `Bearer ${token}`;
		}

		const instance = axios.create({
			baseURL: baseURL,
			timeout: 10000, // timeout value
			headers,
		});

		// Configure axios-retry
		axiosRetry(instance, {
			retries: 3,
			retryDelay: (retryCount) => {
				devLog.info(LogCategory.API_REQUESTS, `Retry attempt: ${retryCount}`);
				return retryCount * 1000;
			},
			retryCondition: (error) => {
				// Retry on network errors and 5xx status codes
				return axiosRetry.isNetworkOrIdempotentRequestError(error) || (error?.response && error.response.status >= 500) || false;
			},
		});

		return instance;
	} catch (error) {
		devLog.error(LogCategory.ERROR, "Error creating axios instance", error);
		throw error;
	}
};

// Function to get Axios instance
const getInstance = async () => {
	const instance = await createInstanceWithToken();
	return instance;
};

export { getInstance };
