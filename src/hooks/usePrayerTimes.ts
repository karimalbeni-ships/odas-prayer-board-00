import { useState, useEffect, useMemo } from 'react';
import {
  getPrayerTimesForDate,
  prayerOrder,
  prayerLabels,
  type DailyPrayerTimes,
  type PrayerName
} from '@/data/prayerTimes';

interface CurrentPrayerInfo {
  current: PrayerName | null;
  next: PrayerName | null;
  nextTime: string | null;
  timeRemaining: string;
  secondsRemaining: number;
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function formatTimeRemaining(seconds: number): string {
  if (seconds < 0) return '00:00:00';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function usePrayerTimes() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [prayerTimes, setPrayerTimes] = useState<DailyPrayerTimes | null>(null);

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Load prayer times for current date
  useEffect(() => {
    const loadTimes = async () => {
      const times = await getPrayerTimesForDate(currentTime);
      setPrayerTimes(times);
    };
    loadTimes();
  }, [currentTime.toDateString()]);

  const currentPrayerInfo = useMemo((): CurrentPrayerInfo => {
    if (!prayerTimes || !prayerTimes.midnight) {
      return { current: null, next: null, nextTime: null, timeRemaining: '00:00:00', secondsRemaining: 0 };
    }

    const now = currentTime.getHours() * 60 + currentTime.getMinutes();
    const nowSeconds = now * 60 + currentTime.getSeconds();

    // Get prayer times in minutes - safely handle all fields
    const prayerMinutes: Record<PrayerName, number> = {
      fajr: timeToMinutes(prayerTimes.fajr || '00:00'),
      sunrise: timeToMinutes(prayerTimes.sunrise || '00:00'),
      dhuhr: timeToMinutes(prayerTimes.dhuhr || '00:00'),
      asr: timeToMinutes(prayerTimes.asr || '00:00'),
      maghrib: timeToMinutes(prayerTimes.maghrib || '00:00'),
      isha: timeToMinutes(prayerTimes.isha || '00:00'),
      midnight: timeToMinutes(prayerTimes.midnight || '23:59'),
    };

    // Find current and next prayer
    // Prayer periods: each prayer is "current" until the next one starts
    let current: PrayerName | null = null;
    let next: PrayerName | null = null;

    // Determine which prayer period we're in
    if (now < prayerMinutes.fajr) {
      // Before Fajr - still in midnight period from previous day
      current = 'midnight';
      next = 'fajr';
    } else if (now < prayerMinutes.sunrise) {
      current = 'fajr';
      next = 'dhuhr';
    } else if (now < prayerMinutes.dhuhr) {
      current = 'sunrise';
      next = 'dhuhr';
    } else if (now < prayerMinutes.asr) {
      current = 'dhuhr';
      next = 'asr';
    } else if (now < prayerMinutes.maghrib) {
      current = 'asr';
      next = 'maghrib';
    } else if (now < prayerMinutes.isha) {
      current = 'maghrib';
      next = 'isha';
    } else if (now < prayerMinutes.midnight) {
      current = 'isha';
      next = 'midnight';
    } else {
      current = 'midnight';
      next = 'fajr'; // Next day's Fajr
    }

    // Calculate time remaining until next prayer
    let nextPrayerMinutes = next ? prayerMinutes[next] : 0;

    // If next is fajr (tomorrow), add 24 hours
    if (next === 'fajr' && now >= prayerMinutes.isha) {
      nextPrayerMinutes += 24 * 60;
    }

    const secondsRemaining = Math.max(0, nextPrayerMinutes * 60 - nowSeconds);
    const timeRemaining = formatTimeRemaining(secondsRemaining);

    return {
      current,
      next,
      nextTime: next ? prayerTimes[next] : null,
      timeRemaining,
      secondsRemaining
    };
  }, [prayerTimes, currentTime]);

  const formattedDate = useMemo(() => {
    const days = ['Sön', 'Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör'];
    const months = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];

    const dayName = days[currentTime.getDay()];
    const day = currentTime.getDate();
    const month = months[currentTime.getMonth()];
    const year = currentTime.getFullYear();

    return `${dayName} ${day} ${month} ${year}`;
  }, [currentTime.toDateString()]);

  const formattedTime = useMemo(() => {
    return currentTime.toLocaleTimeString('sv-SE', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }, [Math.floor(currentTime.getTime() / 1000)]);

  return {
    prayerTimes,
    currentTime,
    currentPrayerInfo,
    formattedDate,
    formattedTime,
    prayerLabels,
    prayerOrder
  };
}
