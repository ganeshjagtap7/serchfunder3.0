import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle /@username rewrite to /username
  if (pathname.startsWith("/@") && pathname.length > 2) {
    const username = pathname.slice(2); // Remove /@

    // Only rewrite if it's not a known route
    const knownRoutes = [
      "/dashboard",
      "/posts",
      "/notifications",
      "/messages",
      "/groups",
      "/explore",
      "/resources",
      "/users",
      "/profile",
      "/login",
      "/register",
      "/auth",
      "/api",
    ];

    const isKnownRoute = knownRoutes.some((route) => username.startsWith(route.slice(1)));

    if (!isKnownRoute) {
      const url = request.nextUrl.clone();
      url.pathname = `/${username}`;
      return NextResponse.rewrite(url);
    }
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session if expired - this is important for server components
  await supabase.auth.getUser();

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
