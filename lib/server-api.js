export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://server.v1.learningcave.com.bd/api/v1";

export async function serverApiFetch(path, options = {}) {
  const { revalidate = 60, cache, ...rest } = options;
  const response = await fetch(`${API_URL}${path}`, {
    ...rest,
    cache,
    next: cache === "no-store" ? undefined : { revalidate },
    headers: {
      "Content-Type": "application/json",
      ...(rest.headers || {}),
    },
  });

  if (!response.ok) {
    const error = new Error(`API request failed (${response.status})`);
    error.status = response.status;
    throw error;
  }

  return response.json();
}
