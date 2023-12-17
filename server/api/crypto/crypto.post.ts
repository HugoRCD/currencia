import { getAllCryptos, getCryptoData } from "~/server/app/cryptoService";

export default eventHandler(async () => {
  console.log("Add new crypto data");
  const cryptos = await getAllCryptos(true);
  const from = new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString().split("T")[0];
  const to = new Date().toISOString().split("T")[0];

  for (const crypto of cryptos) {
    await getCryptoData(crypto.symbol, from, to);
  }
});
