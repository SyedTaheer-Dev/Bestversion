const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

type RequestOptions = RequestInit & {
  auth?: boolean;
};

export async function api<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;

  if (!isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      credentials: "include",
      headers,
    });
  } catch {
    throw new ApiError(
      `Cannot reach backend at ${API_URL}. Start the backend with "npm run server" and make sure MongoDB is running.`,
      0
    );
  }

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    throw new ApiError(data?.message || "Something went wrong", response.status);
  }

  return data as T;
}
