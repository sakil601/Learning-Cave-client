export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://server.v1.learningcave.com.bd/api/v1";

async function readBody(response) {
  const type = response.headers.get("content-type") || "";
  if (type.includes("application/json")) return response.json();
  return null;
}

export async function apiFetch(path, options = {}) {
  const { skipRefresh = false, headers, ...rest } = options;

  const isFormData = typeof FormData !== "undefined" && rest.body instanceof FormData;

  const request = () =>
    fetch(`${API_URL}${path}`, {
      ...rest,
      credentials: "include",
      headers: {
        ...(rest.body && !isFormData ? { "Content-Type": "application/json" } : {}),
        ...(headers || {}),
      },
    });

  let response = await request();
  let data = await readBody(response);

  if (
    response.status === 401 &&
    !skipRefresh &&
    path !== "/auth/login" &&
    path !== "/auth/refresh"
  ) {
    const refreshed = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (refreshed.ok) {
      response = await request();
      data = await readBody(response);
    }
  }

  if (!response.ok) {
    const error = new Error(
      data?.message || data?.error?.message || `Request failed (${response.status})`,
    );
    error.status = response.status;
    error.code = data?.code || data?.error?.code || "API_REQUEST_FAILED";
    error.data = data;
    throw error;
  }

  return data;
}
