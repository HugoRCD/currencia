import { updateVisibleArticle } from "~/server/app/feedService";
import { H3Event } from "h3";
import { updateRoleUser } from "~/server/app/userService";

export default eventHandler(async (event: H3Event) => {
  const params = event.context.params;
  const body = await readBody(event);
  const visible = body.visible;
  if (!params) throw createError({ statusCode: 400, statusMessage: "Missing params" });
  const articleId = parseInt(params.articleId);
  return await updateVisibleArticle(articleId, !visible);
});
