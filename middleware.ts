import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


const isPublicRoute = createRouteMatcher([
    "/",
    "/sign-up(.*)",
    "/subscribe(.*)",
    "/api/webhook(.*)",
    "/api/check-subscription(.*)",
   
])
const isSignUpRoute = createRouteMatcher([
    "/sign-up(.*)",
])
const isMealPlanRoute = createRouteMatcher(["/mealplan(.*)"]);
// 3. Define a route group for Profile Routes (Protected but may not require subscription)
const isProfileRoute = createRouteMatcher(["/profile(.*)"]);

export default clerkMiddleware(async (auth,req) => {
  const userAuth = await auth();
  const { userId } = userAuth;
  const { pathname, origin } = req.nextUrl;
  // If it's the check-subscription route, skip logic to avoid loops
  if (pathname === "/api/check-subscription") {
    return NextResponse.next();
  }
  if (!isPublicRoute(req) && !userId) {
    return NextResponse.redirect(new URL("/sign-up", origin));
  }
  if (isSignUpRoute(req) && userId) {
    return NextResponse.redirect(new URL("/mealplan", origin));
  }
  if ((isMealPlanRoute(req) || isProfileRoute(req)) && userId) {
    try {
      // Make a POST request to our internal API
      const checkSubRes = await fetch(
        `${origin}/api/check-subscription?userId=${userId}`,
        {
          method: "GET",
          headers: {
            // Forward cookies if needed for session checks
            cookie: req.headers.get("cookie") || "",
          },
        }
      );

      // Then parse JSON
      if (checkSubRes.ok) {
        const data = await checkSubRes.json();
        if (!data.subscriptionActive) {
          return NextResponse.redirect(new URL("/subscribe", origin));
        }
      } else {
        // handle error
        return NextResponse.redirect(new URL("/subscribe", origin));
      }
    } catch (error) {
      console.error("Error calling /api/check-subscription:", error);
      return NextResponse.redirect(new URL("/subscribe", origin));
    }
  }

  // Otherwise allow the request
  return NextResponse.next();
});

  

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
