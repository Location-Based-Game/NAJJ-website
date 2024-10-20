export async function fetchApi(route:string) {
    const isDev = process.env.NODE_ENV === "development" || "test"
    const path = isDev ? 'http://localhost:3000' : 'b'
    return await fetch(`${path}${route}`)
}