import { toast } from "sonner";

type ToastType = "success" | "error";

const showToast = (type: ToastType, message: string, title?: string) => {
	if (type === "success") {
		toast.success(title || message, {
			description: title ? message : undefined,
		});
	} else {
		toast.error(title || message, {
			description: title ? message : undefined,
		});
	}
};

export default showToast;
