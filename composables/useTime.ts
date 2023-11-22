// I want to make 5 functions for my timeframe ["1W", "1M", "3M", "6M", "1Y"]
// i want for each function to return a start and end date using timestamp like this [1627776000000, 1627776000000]
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

  const rangeMin = -100;
  const rangeMax = 100;

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
