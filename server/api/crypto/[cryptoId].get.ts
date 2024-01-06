import { H3Event } from "h3";
import { getCryptoOneYear } from "~/server/app/cryptoService";

export default eventHandler(async (event: H3Event) => {
  const params = event.context.params;
  if (!params) throw createError({ statusCode: 400, statusMessage: "Missing params" });
  const cryptoId = parseInt(params.cryptoId);
  if (!cryptoId) throw createError({ statusCode: 400, statusMessage: "Invalid params" });
  const series = await getCryptoOneYear(cryptoId);
  return series;
});
