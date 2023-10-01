import type { APIRoute } from "astro";
import { get as getUtil, post as postUtil, put as putUtil } from "utils/api";
import { getAuthToken } from "utils/getAuthToken";
import type { PushSubscription } from "web-push";

export const GET: APIRoute = async ({ cookies }) => {
  const token = getAuthToken(cookies);

  if (!token) {
    return new Response(null, {
      status: 400,
      statusText: "Please provide an Authorization header with a token.",
    });
  }

  const data = await getUtil<{ status: number; key: string }>({
    path: "/vapid-public-key",
    token,
  });

  return new Response(data.key, { status: data.status });
};

export const POST: APIRoute = async ({ request, cookies }) => {
  const token = getAuthToken(cookies);

  if (!token) {
    return new Response(null, {
      status: 400,
      statusText: "Please provide an Authorization header with a token.",
    });
  }

  const body: { subscription: PushSubscription; origin: string } =
    await request.json();

  const { subscription, origin } = body;

  const response = await postUtil<{ status: number }>({
    path: "/notification",
    token,
    body: { subscription, origin },
  });

  return new Response(null, { status: response.status });
};

export const PUT: APIRoute = async ({ request, cookies }) => {
  const token = getAuthToken(cookies);

  if (!token) {
    return new Response(null, {
      status: 400,
      statusText: "Please provide an Authorization header with a token.",
    });
  }

  const body: { preference: "enabled" | "disabled" } = await request.json();

  const { preference } = body;

  if (preference !== "enabled" && preference !== "disabled") {
    return new Response(null, {
      status: 400,
      statusText:
        "Please provide a `preference` of either 'enabled' or 'disabled'.",
    });
  }

  const response = await putUtil<{ status: number }>({
    path: "/notification",
    token,
    body: { preference },
  });

  return new Response(null, { status: response.status });
};
