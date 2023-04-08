import Cookies from "js-cookie";

export const getClientAuthToken = (): string => {
  const user = Cookies.get("user");

  if (!user) {
    return "";
  }

  return JSON.parse(user).token ?? "";
};
