import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  LinearProgress,
  Chip,
} from '@mui/material';
import {
  TrendingUp,
  Today,
  Whatshot,
  CalendarMonth,
} from '@mui/icons-material';
import type { NippoStats } from '../types/nippo';

interface StatsPanelProps {
  stats: NippoStats;
}

const StatsPanel: React.FC<StatsPanelProps> = ({ stats }) => {
  const getStreakColor = (streak: number) => {
    if (streak >= 7) return 'success';
    if (streak >= 3) return 'warning';
    return 'default';
  };

  const getWeekComparison = () => {
    if (stats.lastWeekCount === 0) return { text: '先週のデータなし', color: 'default' as const };
    
    const diff = stats.thisWeekCount - stats.lastWeekCount;
    if (diff > 0) return { text: `先週より+${diff}件`, color: 'success' as const };
    if (diff < 0) return { text: `先週より${diff}件`, color: 'error' as const };
    return { text: '先週と同じ', color: 'default' as const };
  };

  const weekComparison = getWeekComparison();

  return (
    <Card elevation={2}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TrendingUp color="primary" />
          あなたの日報統計
        </Typography>
        
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Today color="primary" sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant="h4" color="primary">
                {stats.currentStreak}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                連続日数
              </Typography>
              <Chip 
                label={stats.currentStreak >= 3 ? '素晴らしい！' : '頑張ろう！'}
                color={getStreakColor(stats.currentStreak)}
                size="small"
                sx={{ mt: 1 }}
              />
            </Box>
          </Grid>
          
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Whatshot color="error" sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant="h4" color="error">
                {stats.longestStreak}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                最長記録
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <CalendarMonth color="success" sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant="h4" color="success">
                {stats.thisWeekCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                今週の投稿
              </Typography>
              <Chip 
                label={weekComparison.text}
                color={weekComparison.color}
                size="small"
                sx={{ mt: 1 }}
              />
            </Box>
          </Grid>
          
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="text.primary">
                {stats.totalCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                総投稿数
              </Typography>
            </Box>
          </Grid>
        </Grid>
        
        {stats.currentStreak > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              継続率
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={Math.min((stats.currentStreak / 30) * 100, 100)}
              sx={{ height: 8, borderRadius: 4 }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              30日連続まであと{Math.max(30 - stats.currentStreak, 0)}日
            </Typography>
          </Box>
        )}
        
        {stats.currentStreak === 0 && (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
            <Typography variant="body2" color="info.contrastText">
              💡 日報を継続して投稿し、習慣を作りましょう！
            </Typography>
          </Box>
        )}
        
        {stats.currentStreak >= 7 && (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
            <Typography variant="body2" color="success.contrastText">
              🎉 素晴らしい！1週間連続投稿達成です！
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsPanel;