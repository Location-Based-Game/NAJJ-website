export async function fetchApi(route: string, payload: object = {}) {
  const isDev =
    process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test";
  const path = isDev ? "http://localhost:5001/skraggle-2e19f/us-central1/" : "https://us-central1-skraggle-2e19f.cloudfunctions.net/";
  const data = await fetch(`${path}${route}`, {
    method: "POST",
    body: JSON.stringify(payload),
    credentials: "include",
  });
  const res = await data.json();
  if ("error" in res) {
    throw new Error(res.error);
  } else {
    return res.data;
  }
}
