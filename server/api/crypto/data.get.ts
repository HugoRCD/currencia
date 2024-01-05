import { H3Event } from "h3";
import { getCryptoLatestPrice } from "~/server/app/cryptoService";

export default eventHandler(async (event: H3Event) => {
  return getCryptoLatestPrice();
});
