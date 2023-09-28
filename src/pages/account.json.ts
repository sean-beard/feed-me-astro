import type { APIRoute } from "astro";
import { get as getUtil } from "utils/api";
import { getAuthToken } from "utils/getAuthToken";
import type { Account } from "utils/types";

export const GET: APIRoute = async ({ cookies }) => {
  const token = getAuthToken(cookies);

  if (!token) {
    return new Response(null, {
      status: 400,
      statusText: "Please provide an Authorization header with a token.",
    });
  }

  const data = await getUtil<{
    status: number;
    account?: Account;
    message?: string;
  }>({
    path: "/account",
    token,
  });

  return new Response(JSON.stringify(data.account), { status: data.status });
};
