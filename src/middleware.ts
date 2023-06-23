import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({ publicRoutes: ['/', '/demo', '/demo/property/1', '/sign-in']});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/"],
};