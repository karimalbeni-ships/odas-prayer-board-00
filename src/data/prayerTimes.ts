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

export interface PrayerTimesResult {
  times: DailyPrayerTimes | null;
  isExactMatch: boolean;
  displayedDate: string | null;
}

export async function getPrayerTimesForDate(date: Date): Promise<PrayerTimesResult> {
  const dateString = date.toISOString().split('T')[0];
  const targetTime = date.getTime();

  try {
    const prayerData = await fetchPrayerData();

    const exactMatch = prayerData.days.find(d => d.date === dateString);
    if (exactMatch) {
      return { times: exactMatch, isExactMatch: true, displayedDate: exactMatch.date };
    }

    if (prayerData.days.length === 0) {
      return { times: null, isExactMatch: false, displayedDate: null };
    }

    let closestDay = prayerData.days[0];
    let closestDiff = Math.abs(new Date(closestDay.date).getTime() - targetTime);

    for (const day of prayerData.days) {
      const diff = Math.abs(new Date(day.date).getTime() - targetTime);
      if (diff < closestDiff) {
        closestDiff = diff;
        closestDay = day;
      }
    }

    return { times: closestDay, isExactMatch: false, displayedDate: closestDay.date };
  } catch (error) {
    console.error('Error fetching prayer times:', error);
    return { times: null, isExactMatch: false, displayedDate: null };
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
