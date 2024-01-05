import { getAllCryptos, getCryptoData } from "~/server/app/cryptoService";

export default eventHandler(async () => {
  console.log("Add new crypto data");
  const cryptos = await getAllCryptos(true);
  for (const crypto of cryptos) {
    try {
      console.log(crypto.name);
      await getCryptoData(crypto.name, crypto.id, 10);
    } catch (err) {
      console.log(err);
    }
  }
});
