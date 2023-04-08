import type { AstroCookies } from "astro";

export const getAuthToken = (cookies: AstroCookies): string | undefined => {
  const user = cookies.get("user").value;

  if (!user) {
    return undefined;
  }

  return JSON.parse(user).token;
};
