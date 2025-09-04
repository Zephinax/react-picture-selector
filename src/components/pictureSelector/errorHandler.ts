export interface ErrorWithResponse {
  response?: {
    status: number;
    data?: {
      message?: string;
      error?: string;
    };
  };
}

export interface ErrorWithRequest {
  request?: any;
}

export interface ErrorWithMessage {
  message: string;
}

/**
 * Axios error type
 */
export type AxiosError = ErrorWithResponse &
  ErrorWithRequest &
  ErrorWithMessage;

/**
 * Checks if error is an Axios error
 */
export function isAxiosError(error: unknown): error is AxiosError {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    ("response" in error || "request" in error)
  );
}

/**
 * Checks if error is a cancellation error
 */
export function isCancelError(error: unknown): boolean {
  return (
    error instanceof Error &&
    (error.message === "Delete canceled" ||
      error.message === "Upload canceled" ||
      error.message.includes("cancel") ||
      error.message.includes("abort"))
  );
}

/**
 * Converts error to user-friendly string message
 */
export function getErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    // Axios error with response from server
    if (error.response) {
      const status = error.response.status;
      const serverMessage =
        error.response.data?.message || error.response.data?.error;

      switch (status) {
        case 400:
          return serverMessage || "Bad request";
        case 401:
          return "Please log in again";
        case 403:
          return "You do not have permission to perform this action";
        case 404:
          return "The requested resource was not found";
        case 500:
          return serverMessage || "Server error, please try again later";
        default:
          return serverMessage || `Server error: ${status}`;
      }
    } else if (error.request) {
      // Request was made but no response received
      return "Network error: Could not connect to server";
    } else {
      // Other Axios error
      return error.message || "Request configuration error";
    }
  } else if (error instanceof Error) {
    // Standard JavaScript Error
    return error.message;
  } else if (typeof error === "string") {
    // String error
    return error;
  } else {
    // Unknown error
    return "An unexpected error occurred";
  }
}

/**
 * Logs error for developers
 */
export function logError(
  error: unknown,
  context: string = "",
  isTestMode: boolean = false
): void {
  const prefix = isTestMode ? "🧪 Test Mode:" : "";
  const errorMessage = getErrorMessage(error);

  console.error(`${prefix} Error in ${context}:`, errorMessage);
}

/**
 * Unified error handling
 */
export function handleError(
  error: unknown,
  options: {
    setError?: (message: string) => void;
    context?: string;
    isTestMode?: boolean;
    onCancel?: () => void;
  } = {}
): void {
  const {
    setError,
    context = "operation",
    isTestMode = false,
    onCancel,
  } = options;

  // Log the error
  logError(error, context, isTestMode);

  // Handle cancellation errors
  if (isCancelError(error)) {
    if (onCancel) {
      onCancel();
    }
    return;
  }

  // Show error to user if setError function is provided
  if (setError) {
    const errorMessage = getErrorMessage(error);
    setError(errorMessage);
  }
}

/**
 * Extracts HTTP status code from error if available
 */
export function getErrorStatus(error: unknown): number | null {
  if (isAxiosError(error) && error.response) {
    return error.response.status;
  }
  return null;
}

/**
 * Checks if error is a network error (no response received)
 */
export function isNetworkError(error: unknown): boolean {
  return isAxiosError(error) && !!error.request && !error.response;
}

export default {
  isAxiosError,
  isCancelError,
  getErrorMessage,
  logError,
  handleError,
  getErrorStatus,
  isNetworkError,
};
