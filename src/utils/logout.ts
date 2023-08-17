import Cookies from "js-cookie";

export const logout = async () => {
  const response = await fetch(
    `${import.meta.env.PUBLIC_BASE_API_URL}/auth/logout`,
  );
  const data = await response.json();

  if (data.status === 200) {
    Cookies.remove("user");
    window.location.replace("/");
  }

  // TODO: handle error
};
