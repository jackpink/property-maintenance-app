import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({ publicRoutes: ['/', '/demo']});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/"],
};