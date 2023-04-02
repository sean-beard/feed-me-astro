interface RequestWithBodyProps {
  method: string;
  path: string;
  body?: any;
  token?: string;
}

const requestWithBody = async <T>({
  path,
  method,
  token,
  body,
}: RequestWithBodyProps): Promise<T> => {
  const response = await fetch(import.meta.env.PUBLIC_BASE_API_URL + path, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  return data;
};

interface GetProps {
  path: string;
  token: string;
}

export const get = async <T>({ path, token }: GetProps): Promise<T> => {
  return requestWithBody({ method: "GET", path, token });
};

interface PutProps {
  path: string;
  token: string;
  body: any;
}

export const put = async <T>({ path, token, body }: PutProps): Promise<T> => {
  return requestWithBody({ method: "PUT", path, token, body });
};

interface PostProps {
  path: string;
  token: string;
  body: any;
}

export const post = async <T>({ path, token, body }: PostProps): Promise<T> => {
  return requestWithBody({ method: "POST", path, token, body });
};

interface DeleteProps {
  path: string;
  token: string;
  body: any;
}

export const deleteRequest = async <T>({
  path,
  token,
  body,
}: DeleteProps): Promise<T> => {
  return requestWithBody({ method: "DELETE", path, token, body });
};
