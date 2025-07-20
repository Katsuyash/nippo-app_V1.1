export interface Nippo {
  id: string;
  date: string;
  title: string;
  content: string;
  createdAt: string;
  notionPageId?: string;
}

export interface NippoStats {
  totalCount: number;
  currentStreak: number;
  longestStreak: number;
  thisWeekCount: number;
  lastWeekCount: number;
}