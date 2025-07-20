import type { Nippo, NippoStats } from '../types/nippo';
import { format, startOfWeek, endOfWeek, isWithinInterval, differenceInDays } from 'date-fns';

const STORAGE_KEY = 'nippo-data';

export class StorageService {
  static saveNippo(nippo: Nippo): void {
    const existingData = this.getAllNippos();
    const updatedData = [...existingData.filter(n => n.id !== nippo.id), nippo];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
  }

  static getAllNippos(): Nippo[] {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  static deleteNippo(id: string): void {
    const existingData = this.getAllNippos();
    const updatedData = existingData.filter(n => n.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
  }

  static getStats(): NippoStats {
    const nippos = this.getAllNippos();
    const sortedByDate = nippos.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    const totalCount = nippos.length;
    const currentStreak = this.calculateCurrentStreak(sortedByDate);
    const longestStreak = this.calculateLongestStreak(sortedByDate);
    
    const now = new Date();
    const thisWeekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday
    const thisWeekEnd = endOfWeek(now, { weekStartsOn: 1 });
    const lastWeekStart = startOfWeek(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), { weekStartsOn: 1 });
    const lastWeekEnd = endOfWeek(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), { weekStartsOn: 1 });

    const thisWeekCount = nippos.filter(nippo => 
      isWithinInterval(new Date(nippo.date), { start: thisWeekStart, end: thisWeekEnd })
    ).length;

    const lastWeekCount = nippos.filter(nippo => 
      isWithinInterval(new Date(nippo.date), { start: lastWeekStart, end: lastWeekEnd })
    ).length;

    return {
      totalCount,
      currentStreak,
      longestStreak,
      thisWeekCount,
      lastWeekCount,
    };
  }

  private static calculateCurrentStreak(sortedNippos: Nippo[]): number {
    if (sortedNippos.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');
    const yesterdayStr = format(new Date(today.getTime() - 24 * 60 * 60 * 1000), 'yyyy-MM-dd');

    // Check if there's a nippo for today or yesterday
    const hasToday = sortedNippos.some(n => n.date === todayStr);
    const hasYesterday = sortedNippos.some(n => n.date === yesterdayStr);

    if (!hasToday && !hasYesterday) return 0;

    // Start from the most recent date
    let currentDate = hasToday ? today : new Date(today.getTime() - 24 * 60 * 60 * 1000);

    for (let i = sortedNippos.length - 1; i >= 0; i--) {
      const nippoDate = new Date(sortedNippos[i].date);
      const daysDiff = differenceInDays(currentDate, nippoDate);

      if (daysDiff === 0) {
        streak++;
        currentDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
      } else if (daysDiff === 1) {
        // Continue checking for consecutive days
        continue;
      } else {
        break;
      }
    }

    return streak;
  }

  private static calculateLongestStreak(sortedNippos: Nippo[]): number {
    if (sortedNippos.length === 0) return 0;

    let longestStreak = 1;
    let currentStreak = 1;

    for (let i = 1; i < sortedNippos.length; i++) {
      const prevDate = new Date(sortedNippos[i - 1].date);
      const currentDate = new Date(sortedNippos[i].date);
      const daysDiff = differenceInDays(currentDate, prevDate);

      if (daysDiff === 1) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }

    return longestStreak;
  }
}