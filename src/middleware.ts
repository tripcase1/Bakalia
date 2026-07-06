import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get("session_token")?.value;
  const role = request.cookies.get("user_role")?.value;

  const isAuthPage = pathname === "/login" || pathname === "/register";

  if (isAuthPage) {
    if (sessionToken && role) {
      return NextResponse.redirect(new URL(getRoleDashboard(role), request.url));
    }
    return NextResponse.next();
  }

  // Only block protected role-specific routes, not general pages
  const isRoleProtected =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/police") ||
    pathname.startsWith("/council") ||
    pathname.startsWith("/volunteer") ||
    pathname.startsWith("/business") ||
    pathname.startsWith("/moderator") ||
    pathname.startsWith("/editor") ||
    pathname.startsWith("/mosque");

  if (isRoleProtected && (!sessionToken || !role)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // For /dashboard, allow through — page handles its own auth check
  if (pathname.startsWith("/dashboard") && (!sessionToken || !role)) {
    return NextResponse.next();
  }

  // Super Admin bypasses all checks
  if (role === "super_admin") {
    return NextResponse.next();
  }

  // Dashboard role routing rules
  if (pathname.startsWith("/admin") && role !== "super_admin" && role !== "admin") {
    return NextResponse.redirect(new URL(getRoleDashboard(role), request.url));
  }
  if (pathname.startsWith("/police") && role !== "police_admin") {
    return NextResponse.redirect(new URL(getRoleDashboard(role), request.url));
  }
  if (pathname.startsWith("/dashboard") && role !== "citizen") {
    return NextResponse.redirect(new URL(getRoleDashboard(role), request.url));
  }
  if (pathname.startsWith("/council") && role !== "councilor") {
    return NextResponse.redirect(new URL(getRoleDashboard(role), request.url));
  }
  if (pathname.startsWith("/volunteer") && role !== "volunteer") {
    return NextResponse.redirect(new URL(getRoleDashboard(role), request.url));
  }
  if (pathname.startsWith("/business") && role !== "business_admin") {
    return NextResponse.redirect(new URL(getRoleDashboard(role), request.url));
  }
  if (pathname.startsWith("/moderator") && role !== "moderator") {
    return NextResponse.redirect(new URL(getRoleDashboard(role), request.url));
  }
  if (pathname.startsWith("/editor") && role !== "editor") {
    return NextResponse.redirect(new URL(getRoleDashboard(role), request.url));
  }
  if (pathname.startsWith("/mosque") && role !== "mosque_admin") {
    return NextResponse.redirect(new URL(getRoleDashboard(role), request.url));
  }

  return NextResponse.next();
}

function getRoleDashboard(role?: string): string {
  if (!role) return "/";
  switch (role) {
    case "citizen":
      return "/dashboard";
    case "super_admin":
    case "admin":
      return "/admin";
    case "police_admin":
      return "/police";
    case "councilor":
      return "/council";
    case "volunteer":
      return "/volunteer";
    case "mosque_admin":
      return "/mosque";
    case "business_admin":
      return "/business";
    case "moderator":
      return "/moderator";
    case "editor":
      return "/editor";
    default:
      return "/";
  }
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/admin/:path*",
    "/police/:path*",
    "/council/:path*",
    "/volunteer/:path*",
    "/business/:path*",
    "/moderator/:path*",
    "/editor/:path*",
    "/mosque/:path*"
  ]
};
