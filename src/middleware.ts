import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({ publicRoutes: ['/', '/demo', '/demo/property/1']});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/"],
};