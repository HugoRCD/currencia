import { getAllCryptos, getCryptoData } from "~/server/app/cryptoService";
import dayjs from "dayjs";

export default eventHandler(async () => {
  console.log("Add new crypto data");
  const cryptos = await getAllCryptos(true);
  // return from and to dates in timestamp format
  const from = dayjs().subtract(30, "minute").valueOf();
  const to = dayjs().valueOf();

  for (const crypto of cryptos.slice(0, 1)) {
    try {
      console.log(crypto.symbol + " " + from + " " + to);
      await getCryptoData(crypto.symbol, from, to);
    } catch (err) {
      console.log(err);
    }
  }
});
