import type { UpsertCryptoDto } from "~/types/Crypto";
import prisma from "~/server/database/client";

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
  const url = `https://api.tokeninsight.com/api/v1/history/coins/${name.toLowerCase()}?length=${length}`;
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    for (const crypto_info of data.data.market_chart) {
      crypto_info.name = name;
      //console.log(crypto_info.timestamp);
      //console.log(crypto_info.price);
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

export async function getCryptoLatestPrice() {
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
    if (!cryptoData) continue;
    cryptoLatestPrice.push({
      id: crypto.id,
      name: crypto.name,
      price: cryptoData.price,
    });
  }
  return cryptoLatestPrice;
}
