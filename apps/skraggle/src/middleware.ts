import { updateSession } from "@/lib/sessionUtils";
import { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: "/",
};
