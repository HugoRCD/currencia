import { updateCrypto } from "~/server/app/cryptoService";
import { H3Event } from "h3";

export default eventHandler(async (event: H3Event) => {
  const params = event.context.params;
  if (!params) throw createError({ statusCode: 400, statusMessage: "Missing params" });
  const cryptoId = parseInt(params.cryptoId);
  const updateCryptoDto = await readBody(event);
  return await updateCrypto(cryptoId, updateCryptoDto);
});
