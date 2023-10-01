import type { APIRoute } from "astro";
import { get as getUtil } from "utils/api";
import { getAuthToken } from "utils/getAuthToken";
import type { Subscription } from "utils/types";

interface SubscriptionsData {
  status: number;
  subscriptions: Subscription[];
}

export const GET: APIRoute = async ({ cookies }) => {
  const token = getAuthToken(cookies);

  if (!token) {
    return new Response(null, {
      status: 400,
      statusText: "Please provide an Authorization header with a token.",
    });
  }

  const data = await getUtil<SubscriptionsData>({
    path: "/subscription",
    token,
  });

  return new Response(JSON.stringify(data.subscriptions), {
    status: data.status,
  });
};
