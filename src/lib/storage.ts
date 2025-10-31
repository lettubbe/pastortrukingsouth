export const storeData = async (key: string, value: any): Promise<void> => {
	try {
		const jsonValue = JSON.stringify(value);
		localStorage.setItem(key, jsonValue);
	} catch (error) {
		console.error("Error storing data:", error);
		throw error;
	}
};

export const getData = async <T>(key: string): Promise<T | null> => {
	try {
		const jsonValue = localStorage.getItem(key);
		return jsonValue !== null ? JSON.parse(jsonValue) as T : null;
	} catch (error) {
		console.error("Error getting data:", error);
		throw error;
	}
};

export const removeData = async (key: string): Promise<void> => {
	try {
		localStorage.removeItem(key);
		console.log("Removed data with key:", key);
	} catch (error) {
		console.error("Error removing data:", error);
		throw error;
	}
};
