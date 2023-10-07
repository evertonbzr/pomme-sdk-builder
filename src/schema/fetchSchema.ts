export const fetchSchema = async ({
  endpoint,
  usePost = true,
  headers,
  timeout = 20 * 1000,
}: {
  endpoint: string;
  usePost?: boolean;
  timeout?: number;
  headers?: Record<string, string>;
}) => {
  let controller = new AbortController();
  let id = setTimeout(() => {
    controller.abort();
  }, timeout);

  const response = await fetch(endpoint, {
    signal: controller.signal,
    method: "GET",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
  });
  clearTimeout(id);

  if (!response.ok) {
    throw new Error(
      `introspection for ${endpoint} failed, ${response.status} ${response.statusText}`
    );
  }

  const result = await response.json().catch((e) => {
    const contentType = response.headers.get("Content-Type");

    throw new Error(
      `endpoint '${endpoint}' did not return valid json, content type is ${contentType}, check that your endpoint points to a valid graphql api`
    );
  });

  if (!result.payload) {
    throw new Error(
      `introspection for ${endpoint} failed: ${JSON.stringify(result).slice(
        0,
        400
      )}...`
    );
  }

  return result;
};
