import type { ApexChartSeries } from "~/types/ApexChart";

export const getCurrentWeek = () => {
  const dayjs = useDayjs();
  const start = dayjs().startOf("week").valueOf();
  const end = dayjs().endOf("week").valueOf();
  return {
    start,
    end,
  };
};

export const getCurrentMonth = () => {
  const dayjs = useDayjs();
  const start = dayjs().startOf("month").valueOf();
  const end = dayjs().endOf("month").valueOf();
  return {
    start,
    end,
  };
};

export const getCurrent3Months = () => {
  const dayjs = useDayjs();
  const start = dayjs().subtract(3, "month").valueOf();
  const end = dayjs().valueOf();
  return {
    start,
    end,
  };
};

export const getCurrent6Months = () => {
  const dayjs = useDayjs();
  const start = dayjs().subtract(6, "month").valueOf();
  const end = dayjs().valueOf();
  return {
    start,
    end,
  };
};

export const getCurrentYear = () => {
  const dayjs = useDayjs();
  const start = dayjs().startOf("year").valueOf();
  const end = dayjs().endOf("year").valueOf();
  return {
    start,
    end,
  };
};

export const getRandomDailyData = (): ApexChartSeries["data"] => {
  const dayjs = useDayjs();
  const start = dayjs().startOf("year").valueOf();
  const days = dayjs().diff(start, "day") + 1;
  const data = [] as ApexChartSeries["data"];

  const rangeMin = -1000;
  const rangeMax = 1000;

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
