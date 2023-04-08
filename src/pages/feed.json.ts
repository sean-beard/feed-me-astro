import type { APIRoute } from "astro";
import type { GetFeedResponse } from "utils/types";
import { get as getRequest } from "utils/api";
import { MAX_NUM_FEED_ITEMS } from "utils/consts";
import { getAuthToken } from "utils/getAuthToken";

export const get: APIRoute = async ({ request, cookies }) => {
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

  try {
    const data = await getRequest<GetFeedResponse>({ path: "/feed", token });

    if (data.status !== 200) {
      return new Response(null, {
        status: 500,
        statusText: "Error fetching feed.",
      });
    }

    return {
      body: JSON.stringify(data.feed.slice(0, MAX_NUM_FEED_ITEMS)),
    };
  } catch {
    return new Response(null, {
      status: 500,
      statusText: "Error fetching feed.",
    });
  }
};
