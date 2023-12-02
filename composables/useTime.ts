import type { ApexChartSeries } from "~/types/ApexChart";

export const getLastWeek = () => {
  const dayjs = useDayjs();
  const start = dayjs().subtract(7, "day").valueOf();
  const end = dayjs().valueOf();
  return {
    start,
    end,
  };
};

export const getLastMonth = () => {
  const dayjs = useDayjs();
  const start = dayjs().subtract(1, "month").valueOf();
  const end = dayjs().valueOf();
  return {
    start,
    end,
  };
};

export const getLast3Months = () => {
  const dayjs = useDayjs();
  const start = dayjs().subtract(3, "month").valueOf();
  const end = dayjs().valueOf();
  return {
    start,
    end,
  };
};

export const getLast6Months = () => {
  const dayjs = useDayjs();
  const start = dayjs().subtract(6, "month").valueOf();
  const end = dayjs().valueOf();
  return {
    start,
    end,
  };
};

export const getLastYear = () => {
  const dayjs = useDayjs();
  const start = dayjs().subtract(1, "year").valueOf();
  const end = dayjs().valueOf();
  return {
    start,
    end,
  };
};

export const getRandomDailyData = (): ApexChartSeries["data"] => {
  const dayjs = useDayjs();
  const start = dayjs().subtract(1, "year").valueOf();
  const days = dayjs().diff(start, "day") + 1;
  const data = [] as ApexChartSeries["data"];

  const rangeMin = 300;
  const rangeMax = 10000;

  const getRandomValue = () => {
    return Math.floor(Math.random() * (rangeMax - rangeMin + 1)) + rangeMin;
  };

  for (let i = 0; i < days; i++) {
    const timestamp = start + i * 86400000;
    const currentValue = data.length > 0 ? data[i - 1][1] : getRandomValue();
    const randomValue = getRandomValue();
    const value = currentValue + (randomValue - currentValue) / 10; // Contrôle la régularité des données en ajustant le diviseur (10 dans cet exemple)
    data.push([timestamp, value]);
  }

  return data;
};

export function formatDate(date: string) {
  const dayjs = useDayjs();
  return dayjs(date).format("DD/MM/YYYY");
}
