import { NextResponse } from "next/server";
import { auth } from "@/auth-edge";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;
  const isAuthPage =
    nextUrl.pathname === "/login" || nextUrl.pathname === "/register";

  const editorOnlyPaths = ["/assets/new", "/vendors/new"];
  const isEditorOnly = editorOnlyPaths.some(
    (path) =>
      nextUrl.pathname === path || nextUrl.pathname.startsWith(`${path}/`)
  );

  if (isLoggedIn && isEditorOnly && role === "viewer") {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  if (isAuthPage) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    const loginUrl = new URL("/login", nextUrl);
    if (nextUrl.pathname !== "/") {
      loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
