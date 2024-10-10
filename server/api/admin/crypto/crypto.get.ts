import { getAllCryptos } from "~~/server/app/cryptoService";

export default eventHandler(async () => {
  return getAllCryptos(true);
});
