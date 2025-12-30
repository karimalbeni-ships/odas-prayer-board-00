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

// Cache for loaded prayer data
let cachedPrayerData: MonthlyPrayerData | null = null;

// Fetch prayer times from latest.json
export async function fetchPrayerData(): Promise<MonthlyPrayerData> {
  if (cachedPrayerData) {
    return cachedPrayerData;
  }

  const response = await fetch('/latest.json');
  if (!response.ok) {
    throw new Error('Failed to load prayer times');
  }

  cachedPrayerData = await response.json();
  return cachedPrayerData!;
}

export async function getPrayerTimesForDate(date: Date): Promise<DailyPrayerTimes | null> {
  const dateString = date.toISOString().split('T')[0];

  try {
    const prayerData = await fetchPrayerData();
    const dayData = prayerData.days.find(d => d.date === dateString);
    return dayData || prayerData.days[0] || null;
  } catch (error) {
    console.error('Error fetching prayer times:', error);
    return null;
  }
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
