export const formatTime = (time: string) => {
  const dayjs = useDayjs();
  return dayjs(time).format("DD-MM-YYYY HH:mm:ss");
};

export const formatTimeFrame = (times: string[]) => {
  const dayjs = useDayjs();
  return times.map((time) => {
    return dayjs(time).format("DD-MM-YYYY HH:mm:ss");
  });
};

export const getTodayHours = () => {
  const dayjs = useDayjs();
  const today = dayjs();
  const hours = [];
  for (let i = 0; i <= 23; i++) {
    hours.push(today.hour(i));
  }
  return hours;
};

export const getCurrentWeek = () => {
  const dayjs = useDayjs();
  const today = dayjs();
  const weekStart = today.startOf("week");
  today.endOf("week");
  const days = [];
  for (let i = 0; i <= 6; i++) {
    days.push(weekStart.add(i, "day"));
  }
  return days;
};

export const getCurrentMonth = () => {
  const dayjs = useDayjs();
  const today = dayjs();
  const monthStart = today.startOf("month");
  today.endOf("month");
  const days = [];
  for (let i = 0; i <= 30; i++) {
    days.push(monthStart.add(i, "day"));
  }
  return days;
};

export const getCurrent3Months = () => {
  const dayjs = useDayjs();
  const today = dayjs();
  const monthStart = today.startOf("month");
  today.endOf("month");
  const days = [];
  for (let i = 0; i <= 90; i++) {
    days.push(monthStart.add(i, "day"));
  }
  return days;
};

export const getCurrent6Months = () => {
  const dayjs = useDayjs();
  const today = dayjs();
  const monthStart = today.startOf("month");
  today.endOf("month");
  const days = [];
  for (let i = 0; i <= 180; i++) {
    days.push(monthStart.add(i, "day"));
  }
  return days;
};

export const getCurrentYear = () => {
  const dayjs = useDayjs();
  const today = dayjs();
  const yearStart = today.startOf("year");
  today.endOf("year");
  const days = [];
  for (let i = 0; i <= 365; i++) {
    days.push(yearStart.add(i, "day"));
  }
  return days;
};
