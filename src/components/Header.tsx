import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Chip, Box } from '@mui/material';
import { Settings, CheckCircle } from '@mui/icons-material';
import { format } from 'date-fns';

interface HeaderProps {
  onConfigClick: () => void;
  notionConfigured: boolean;
}

const Header: React.FC<HeaderProps> = ({ onConfigClick, notionConfigured }) => {
  return (
    <AppBar position="static" elevation={1}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          📝 日報アプリ
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2">
            {format(new Date(), 'yyyy年MM月dd日')}
          </Typography>
          <Chip 
            icon={<CheckCircle />}
            label={notionConfigured ? 'Notion連携済み' : 'Notion未設定'}
            color={notionConfigured ? 'success' : 'default'}
            variant={notionConfigured ? 'filled' : 'outlined'}
            size="small"
          />
          <IconButton color="inherit" onClick={onConfigClick}>
            <Settings />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
