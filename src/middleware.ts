import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  debug: false,
  ignoredRoutes: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"]
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
