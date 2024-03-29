import type { APIRoute } from "astro";
import { put as putRequest } from "utils/api";
import { getAuthToken } from "utils/getAuthToken";

interface Body {
  items: any[];
}

export const PUT: APIRoute = async ({ request, cookies }) => {
  if (request.headers.get("Content-Type") !== "application/json") {
    return new Response(null, {
      status: 400,
      statusText: "Only JSON content is supported.",
    });
  }

  const token = getAuthToken(cookies);

  if (!token) {
    return new Response(null, {
      status: 400,
      statusText: "Please provide an Authorization header with a token.",
    });
  }

  const body: Body = await request.json();

  if (!body || !body.items) {
    return new Response(null, {
      status: 400,
      statusText: "Please provide a `body` with `items`.",
    });
  }

  try {
    const data = await putRequest<{ status: number }>({
      path: "/item",
      token: token,
      body: { items: body.items },
    });

    return new Response(null, { status: data.status });
  } catch {
    return new Response(null, {
      status: 500,
      statusText: "Error updating items.",
    });
  }
};
