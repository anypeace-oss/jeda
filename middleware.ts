import { betterFetch } from "@better-fetch/fetch";
import type { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

type Session = typeof auth.$Infer.Session;

const authPaths = ["/login"];

const isAuthPath = (path: string) => authPaths.includes(path);

export async function middleware(request: NextRequest) {
  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: request.nextUrl.origin,
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    }
  );

  const pathname = request.nextUrl.pathname;

  //  Jika user sudah login dan mencoba ke /login, redirect ke /dashboard
  if (session && isAuthPath(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  //  Jika user belum login dan mengakses halaman yang bukan auth path, redirect ke /login
  if (!session && !isAuthPath(pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// Sesuaikan matcher agar middleware ini juga menangani /login
export const config = {
  matcher: ["/dashboard", "/login"], // tambahkan "/login" di sini
};
