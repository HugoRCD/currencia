import type { UpsertCryptoDto } from "~/types/Crypto";
import prisma from "~/server/database/client";

export async function getAllCryptos(all: boolean = false) {
  if (!all) {
    return prisma.crypto.findMany({
      where: {
        visible: true,
      },
    });
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

export async function getCryptoData(symbol: string, from: number, to: number) {
  const runtimeConfig = useRuntimeConfig().private.finageApiKey;
  const url = `https://api.finage.co.uk/history/crypto/depth/${symbol.toLowerCase()}usd/${from}/${to}?apikey=${runtimeConfig}`
  console.log(url);
  const response = await fetch(url, {
    method: "GET",
  });
  const data = await response.json();
  console.log(data);
  return data;
}