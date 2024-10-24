export async function fetchApi(route: string) {
  const isDev = process.env.NODE_ENV === "development" || "test";
  //TODO replace path with production URL
  const path = isDev ? "http://localhost:3000" : "b";
  const data = await fetch(`${path}${route}`);
  const res = await data.json();
  if (res.error) {
    throw new Error(res.error);
  } else {
    return res;
  }
}
