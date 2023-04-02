import type { AstroCookies } from "astro";

export const getAuthToken = (cookies: AstroCookies): string | undefined => {
  return cookies.get("token").value;
};
