export interface PrayerTimes {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

export function getPrayerTimes(date: Date): PrayerTimes {
  // Return exact user-specified timings for July
  if (date.getMonth() === 6) {
    return {
      Fajr: "3:48 AM",
      Dhuhr: "12:02 PM",
      Asr: "4:44 PM",
      Maghrib: "6:44 PM",
      Isha: "8:01 PM",
    };
  }

  // Calculate day of the year
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  // Approximate solar declination wave (peaks around summer solstice day 172)
  const declinationFactor = Math.sin(((dayOfYear - 80) * 2 * Math.PI) / 365);

  // Base prayer hours in UTC+6 for Chattogram, Bangladesh
  // Fajr: earlier in summer (around 3:45 AM / 3.75h), later in winter (around 5:20 AM / 5.33h)
  const fajrHour = 4.54 - decljs(declinationFactor) * 0.75;
  
  // Dhuhr: standard local noon fluctuates slightly (11:58 AM to 12:12 PM)
  const dhuhrHour = 12.05 - Math.sin((dayOfYear * 4 * Math.PI) / 365) * 0.12;
  
  // Asr: mid afternoon, ranges from 3:35 PM (15.58h) in winter to 4:45 PM (16.75h) in summer
  const asrHour = 16.15 + decljs(declinationFactor) * 0.6;
  
  // Maghrib: Sunset ranges from 5:10 PM (17.16h) in winter to 6:45 PM (18.75h) in summer
  const maghribHour = 17.95 + decljs(declinationFactor) * 0.8;
  
  // Isha: Night starts around 6:30 PM (18.5h) in winter to 8:10 PM (20.16h) in summer
  const ishaHour = 19.2 + decljs(declinationFactor) * 0.85;

  return {
    Fajr: formatHour(fajrHour),
    Dhuhr: formatHour(dhuhrHour),
    Asr: formatHour(asrHour),
    Maghrib: formatHour(maghribHour),
    Isha: formatHour(ishaHour),
  };
}

function decljs(factor: number): number {
  return factor;
}

function formatHour(decimalHour: number): string {
  const hour = Math.floor(decimalHour);
  const minutes = Math.floor((decimalHour - hour) * 60);
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${displayHour}:${displayMinutes} ${period}`;
}

export function getNextPrayer(times: PrayerTimes, currentTime: Date): { name: keyof PrayerTimes; timeStr: string } {
  const currentHours = currentTime.getHours() + currentTime.getMinutes() / 60;
  
  const parseTimeToHours = (timeStr: string): number => {
    const [time, period] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
    return hours + minutes / 60;
  };

  const prayers: { name: keyof PrayerTimes; hours: number; timeStr: string }[] = [
    { name: "Fajr", hours: parseTimeToHours(times.Fajr), timeStr: times.Fajr },
    { name: "Dhuhr", hours: parseTimeToHours(times.Dhuhr), timeStr: times.Dhuhr },
    { name: "Asr", hours: parseTimeToHours(times.Asr), timeStr: times.Asr },
    { name: "Maghrib", hours: parseTimeToHours(times.Maghrib), timeStr: times.Maghrib },
    { name: "Isha", hours: parseTimeToHours(times.Isha), timeStr: times.Isha },
  ];

  // Find the first prayer that is after the current time
  for (const prayer of prayers) {
    if (currentHours < prayer.hours) {
      return { name: prayer.name, timeStr: prayer.timeStr };
    }
  }
  
  // If we are past Isha, the next prayer is Fajr of the next day
  return { name: "Fajr", timeStr: times.Fajr };
}
