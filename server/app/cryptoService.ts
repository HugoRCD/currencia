import type { UpsertCryptoDto } from "~/types/Crypto";
import prisma from "~/server/database/client";
import dayjs from "dayjs";

export async function getAllCryptos(all: boolean = false) {
  if (!all) {
    const cryptos = await prisma.crypto.findMany({
      where: {
        visible: true,
      },
    });
    const cryptoData = await prisma.cryptoData.findMany({
      where: {
        cryptoId: {
          in: cryptos.map((crypto) => crypto.id),
        },
      },
      orderBy: {
        timestamp: "desc",
      },
    });
    for (const crypto of cryptos) {
      const cryptoDataIndex = cryptoData.findIndex((cryptoData) => cryptoData.cryptoId === crypto.id);
      if (cryptoDataIndex === -1) {
        crypto.price = 0;
        continue;
      }
      crypto.price = cryptoData[cryptoDataIndex].price;
    }
    return cryptos;
  } else {
    return prisma.crypto.findMany();
  }
}

export async function upsertCrypto(upsertCryptoDto: UpsertCryptoDto) {
  return prisma.crypto.upsert({
    where: {
      name: upsertCryptoDto.name,
    },
    update: upsertCryptoDto,
    create: upsertCryptoDto,
  });
}

export async function deleteCrypto(cryptoId: number) {
  return prisma.crypto.delete({
    where: {
      id: cryptoId,
    },
  });
}
export async function getCryptoData(name: string, cryptoId: number, length: number) {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      TI_API_KEY: process.env.TOKENINSIGHT_API_KEY,
    },
  };
  const cryptoName = name.toLowerCase().replace(" ", "-");
  const url = `https://api.tokeninsight.com/api/v1/history/coins/${cryptoName}?length=${length}`;
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    for (const crypto_info of data.data.market_chart) {
      crypto_info.name = name;

      const cryptoData = await prisma.cryptoData.findFirst({
        where: {
          cryptoId,
          timestamp: crypto_info.timestamp,
        },
      });
      if (cryptoData) {
        continue;
      }
      await prisma.cryptoData.create({
        data: {
          cryptoId,
          timestamp: crypto_info.timestamp,
          price: crypto_info.price,
        },
      });
    }
    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function getCurrentCryptoData(name: string, cryptoId: number, length: number) {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      TI_API_KEY: process.env.TOKENINSIGHT_API_KEY,
    },
  };
  const cryptoName = name.toLowerCase().replace(" ", "-");
  const url = `https://api.tokeninsight.com/api/v1/coins/${cryptoName}`;
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    const cryptoData = await prisma.cryptoData.findFirst({
      where: {
        cryptoId,
        timestamp: data.status.timestamp,
      },
    });
    if (cryptoData) {
      return;
    }
    const createdCrypto = await prisma.cryptoData.create({
      data: {
        cryptoId,
        timestamp: data.status.timestamp,
        price: data.data.market_data.price[0].price_latest,
      },
    });
    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function getCryptosLatestPrice() {
  const cryptos = await getAllCryptos();
  const cryptoLatestPrice = [];
  for (const crypto of cryptos) {
    const cryptoData = await prisma.cryptoData.findFirst({
      where: {
        cryptoId: crypto.id,
      },
      orderBy: {
        timestamp: "desc",
      },
    });
    if (!cryptoData) {
      continue;
    }
    const timestamp = dayjs(parseInt(cryptoData.timestamp.toString())).unix();
    const now = dayjs().unix();
    const difference = now - timestamp;
    if (difference > 300) {
      await getCurrentCryptoData(crypto.name, crypto.id, 1);
    }
    cryptoLatestPrice.push([crypto.id, cryptoData.price]);
  }
  const updatedCryptos = await getAllCryptos();
  return updatedCryptos.map((crypto) => {
    const cryptoLatestPriceIndex = cryptoLatestPrice.findIndex((cryptoLatestPrice) => cryptoLatestPrice[0] === crypto.id);
    if (cryptoLatestPriceIndex === -1) {
      crypto.price = 0;
      return crypto;
    }
    crypto.price = cryptoLatestPrice[cryptoLatestPriceIndex][1];
    return crypto;
  });
}

export async function getCryptoOneYear(cryptoId: number) {
  const cryptoData = await prisma.cryptoData.findMany({
    where: {
      cryptoId,
    },
    orderBy: {
      timestamp: "asc",
    },
  });
  return cryptoData.map((crypto) => [parseInt(crypto.timestamp.toString()), crypto.price]);
}
