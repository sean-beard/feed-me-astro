import jwt from "jsonwebtoken";
import type { AstroCookies } from "astro";
import type { User } from "./types";

export const getUser = (cookies: AstroCookies) => {
  let user: User | undefined;
  const userJwt = cookies.get("user").value ?? "";

  try {
    user = jwt.verify(userJwt, import.meta.env.SECRET_JWT_KEY) as User;
  } catch {
    console.log("User not found in JWT");
  }

  return user;
};

export const getAuthToken = (cookies: AstroCookies): string => {
  const user = getUser(cookies);

  if (!user) {
    return "";
  }

  return user.token;
};
