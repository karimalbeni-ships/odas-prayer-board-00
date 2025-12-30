export interface DailyPrayerTimes {
  date: string; // YYYY-MM-DD format
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  midnight: string;
}

export interface MonthlyPrayerData {
  month: string; // YYYY-MM format
  location: string;
  days: DailyPrayerTimes[];
}

// Sample prayer times data for December 2025
// In production, this would be loaded from uploaded JSON files
export const decemberPrayerTimes: MonthlyPrayerData = {
  month: "2025-12",
  location: "Stockholm",
  days: [
    { date: "2025-12-24", fajr: "06:10", sunrise: "08:49", dhuhr: "11:43", asr: "13:20", maghrib: "14:47", isha: "16:12", midnight: "23:29" },
    { date: "2025-12-25", fajr: "06:10", sunrise: "08:49", dhuhr: "11:44", asr: "13:21", maghrib: "14:48", isha: "16:13", midnight: "23:29" },
    { date: "2025-12-26", fajr: "06:10", sunrise: "08:49", dhuhr: "11:44", asr: "13:22", maghrib: "14:49", isha: "16:14", midnight: "23:30" },
    { date: "2025-12-27", fajr: "06:10", sunrise: "08:48", dhuhr: "11:45", asr: "13:23", maghrib: "14:50", isha: "16:15", midnight: "23:30" },
    { date: "2025-12-28", fajr: "06:10", sunrise: "08:48", dhuhr: "11:45", asr: "13:24", maghrib: "14:51", isha: "16:16", midnight: "23:31" },
    { date: "2025-12-29", fajr: "06:09", sunrise: "08:48", dhuhr: "11:46", asr: "13:25", maghrib: "14:52", isha: "16:17", midnight: "23:31" },
    { date: "2025-12-30", fajr: "06:09", sunrise: "08:47", dhuhr: "11:46", asr: "13:26", maghrib: "14:53", isha: "16:18", midnight: "23:32" },
    { date: "2025-12-31", fajr: "06:08", sunrise: "08:47", dhuhr: "11:47", asr: "13:27", maghrib: "14:55", isha: "16:20", midnight: "23:32" },
  ]
};

export const allPrayerData: MonthlyPrayerData[] = [decemberPrayerTimes];

export function getPrayerTimesForDate(date: Date): DailyPrayerTimes | null {
  const dateString = date.toISOString().split('T')[0];
  
  for (const monthData of allPrayerData) {
    const dayData = monthData.days.find(d => d.date === dateString);
    if (dayData) return dayData;
  }
  
  // Fallback to sample data for demo purposes
  return decemberPrayerTimes.days[0];
}

export type PrayerName = 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha' | 'midnight';

export const prayerLabels: Record<PrayerName, string> = {
  fajr: 'Fajr',
  sunrise: 'Soluppgång',
  dhuhr: 'Dhuhr',
  asr: 'Asr',
  maghrib: 'Maghrib',
  isha: 'Isha',
  midnight: 'Halva natten'
};

export const prayerOrder: PrayerName[] = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha', 'midnight'];
