import type { UpsertCryptoDto } from "~/types/Crypto";
import prisma from "~/server/database/client";
import dayjs from "dayjs";

function smoothCryptoData(cryptoData: [timestamp: number, value: number][], windowSize: number) {
  const smoothedData = [];

  for (let i = 0; i < cryptoData.length; i++) {
    let sum = 0;
    let count = 0;

    for (let j = Math.max(0, i - windowSize); j <= Math.min(cryptoData.length - 1, i + windowSize); j++) {
      sum += cryptoData[j][1];
      count++;
    }

    smoothedData.push([cryptoData[i][0], sum / count]);
  }

  return smoothedData;
}

export async function getAllCryptos(all: boolean = false) {
  const cryptos = await prisma.crypto.findMany();
  const cryptoList = cryptos.map((crypto) => {
    const data = [];
    for (let i = 0; i < 365; i++) {
      data.push([dayjs().subtract(i, "day").valueOf(), Math.floor(Math.random() * (10000 - 300 + 1)) + 300]);
    }
    crypto.data = smoothCryptoData(data, 7);
    return crypto;
  });
  if (!all) return cryptoList.filter((crypto) => crypto.visible);
  return cryptoList;
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
