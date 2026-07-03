export interface PrayerTimes {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

// Helper to convert "18:45" to "6:45 PM"
export function convert24To12(time24: string): string {
  const [hourStr, minuteStr] = time24.split(":");
  const hour = parseInt(hourStr, 10);
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${minuteStr} ${period}`;
}

export async function fetchLivePrayerTimes(latitude?: number, longitude?: number): Promise<PrayerTimes | null> {
  try {
    let url = "https://api.aladhan.com/v1/timingsByCity?city=Chittagong&country=Bangladesh&method=2";
    if (latitude !== undefined && longitude !== undefined) {
      url = `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=2`;
    }

    const response = await fetch(url, { next: { revalidate: 3600 } }); // Cache for 1 hour
    if (!response.ok) throw new Error("Prayer times fetch failed");
    
    const json = await response.json();
    const timings = json.data?.timings;
    if (!timings) return null;

    return {
      Fajr: convert24To12(timings.Fajr),
      Dhuhr: convert24To12(timings.Dhuhr),
      Asr: convert24To12(timings.Asr),
      Maghrib: convert24To12(timings.Maghrib),
      Isha: convert24To12(timings.Isha)
    };
  } catch (error) {
    console.warn("Failed to fetch live prayer times from API, falling back to local formulas:", error);
    return null;
  }
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
  const fajrHour = 4.54 - decljs(declinationFactor) * 0.75;
  const dhuhrHour = 12.05 - Math.sin((dayOfYear * 4 * Math.PI) / 365) * 0.12;
  const asrHour = 16.15 + decljs(declinationFactor) * 0.6;
  const maghribHour = 17.95 + decljs(declinationFactor) * 0.8;
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
