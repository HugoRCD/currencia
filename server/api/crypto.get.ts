import { getAllCryptos, getCryptosLatestPrice } from "~/server/app/cryptoService";

export default eventHandler(async () => {
  return getCryptosLatestPrice();
});
