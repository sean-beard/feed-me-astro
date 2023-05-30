import type { APIRoute } from "astro";
import { post as postUtil } from "utils/api";
import { getAuthToken } from "utils/getAuthToken";
import type { Feed } from "utils/types";

interface SearchPayload {
  status: number;
  feed: Feed;
}

export const post: APIRoute = async ({ request, cookies }) => {
  const token = getAuthToken(cookies);

  if (!token) {
    return new Response(null, {
      status: 400,
      statusText: "Please provide an Authorization header with a token.",
    });
  }

  const body: { searchTerm: string } = await request.json();
  const term = body.searchTerm;

  const response = await postUtil<SearchPayload>({
    path: "/feed",
    token,
    body: { term },
  });

  return new Response(JSON.stringify(response.feed), {
    status: response.status,
  });
};
