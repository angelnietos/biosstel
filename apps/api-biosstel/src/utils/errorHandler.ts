export interface StandardErrorResponse {
  success: boolean;
  message: string;
  error: string;
  version: string;
  data?: null;
}

const formatDateTime = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

export const handleMicroserviceError = (
  error: any,
  dataSourceName: string,
  context: string,
  version: string = "0.0.1"
): StandardErrorResponse | any => {
  const now = new Date();
  const formattedDateTime = formatDateTime(now);

  console.error(`[${formattedDateTime}] - [${dataSourceName}] Error [${context}]:`, {
    timestamp: now.toISOString(),
    dataSource: dataSourceName,
    context,
    message: error.message,
    status: error.extensions?.response?.status,
    body: error.extensions?.response?.body,
  });

  const isProduction = process.env.NODE_ENV === "production";

  if (error.extensions?.response?.status) {
    const status = error.extensions.response.status;
    const body = error.extensions.response.body;

    if (status >= 400 && status < 500) {
      if (body && typeof body === "object" && body.success !== undefined) {
        return body;
      }
      return {
        success: false,
        message: body?.message || "Request error",
        error: body?.error || body || "CLIENT_ERROR",
        version,
        data: null,
      };
    }

    if (status >= 500) {
      return {
        success: false,
        message: isProduction
          ? "An error occurred. Please try again later."
          : `Server error (${status}): ${body?.message || "Internal server error"}`,
        error: isProduction ? "SERVICE_UNAVAILABLE" : (body?.error || error.message || `HTTP_${status}`),
        version,
        data: null,
      };
    }

    if (body && typeof body === "object") {
      return body;
    }
  }

  return {
    success: false,
    message: isProduction
      ? "Unable to process your request. Please try again."
      : `Service communication error: ${error.message || "Unknown error"}`,
    error: isProduction ? "SERVICE_ERROR" : (error.code || error.message || "UNKNOWN_ERROR"),
    version,
    data: null,
  };
};
