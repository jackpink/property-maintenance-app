import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({ publicRoutes: ['/', '/demo', '/demo/property/1', '/sign-in', '/create-account', '/create-account/homeowner']});

export const config = {
  matcher: [
    "/(.*?trpc.*?|(?!static|.*\\..*|_next|favicon.ico).*)",
    "/"
  ],
};