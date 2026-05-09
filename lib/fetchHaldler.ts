import { errorResponse } from "./response";

interface FetchOption extends RequestInit {
  timeout?: number;
}
export async function fetchHandler(url: string, options: FetchOption = {}) {
  const { timeout = 5000, headers: customHeaders, ...restOptions } = options;
  const controller = new AbortController();

  const id = setTimeout(() => {
    controller.abort();
  }, timeout);

  const defaultHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const config = {
    ...restOptions,
    headers: {
      ...defaultHeaders,
      ...customHeaders,
    },
    signal: controller.signal,
  };

  try {
    const response = await fetch(url, config);
    clearTimeout(id);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return await response.json();
  } catch (error) {
    if (error instanceof Error && error.message === "AbortError") {
      return errorResponse(error, 504);
    } else {
      return errorResponse(error, 500);
    }
  }
}
