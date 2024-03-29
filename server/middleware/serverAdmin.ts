import { adminCheck } from "~/server/app/userService";
import { H3Event } from "h3";

export default eventHandler(async (event) => {
  const isAllowed = await protectAdminRoute(event);

  if (!isAllowed) {
    return sendError(
      event,
      createError({
        statusCode: 401,
        statusMessage: "Insufficient permissions",
      }),
    );
  }
});

async function protectAdminRoute(event: H3Event): Promise<boolean> {
  const protectedRoutes = ["/api/admin"];

  if (event.path === undefined || !protectedRoutes.some((route) => event.path?.startsWith(route))) {
    return true;
  } else {
    return await adminCheck(event);
  }
}
