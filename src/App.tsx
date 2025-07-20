import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, Box } from '@mui/material';
import Header from './components/Header';
import NippoForm from './components/NippoForm';
import NippoList from './components/NippoList';
import StatsPanel from './components/StatsPanel';
import NotionConfig from './components/NotionConfig';
import type { Nippo, NippoStats } from './types/nippo';
import { StorageService } from './services/storageService';
import { notionService } from './services/notionService';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const App: React.FC = () => {
  const [nippos, setNippos] = useState<Nippo[]>([]);
  const [stats, setStats] = useState<NippoStats>({
    totalCount: 0,
    currentStreak: 0,
    longestStreak: 0,
    thisWeekCount: 0,
    lastWeekCount: 0,
  });
  const [showNotionConfig, setShowNotionConfig] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const loadedNippos = StorageService.getAllNippos();
    const loadedStats = StorageService.getStats();
    setNippos(loadedNippos);
    setStats(loadedStats);
  };

  const handleSaveNippo = async (nippo: Omit<Nippo, 'id' | 'createdAt'>) => {
    const newNippo: Nippo = {
      ...nippo,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    // Save to local storage
    StorageService.saveNippo(newNippo);

    // Try to save to Notion
    if (notionService.isConfigured()) {
      const notionPageId = await notionService.createPage(newNippo);
      if (notionPageId) {
        const nippoWithNotionId = { ...newNippo, notionPageId };
        StorageService.saveNippo(nippoWithNotionId);
      }
    }

    loadData();
  };

  const handleDeleteNippo = (id: string) => {
    StorageService.deleteNippo(id);
    loadData();
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md">
        <Header 
          onConfigClick={() => setShowNotionConfig(true)}
          notionConfigured={notionService.isConfigured()}
        />
        <Box sx={{ my: 3 }}>
          <StatsPanel stats={stats} />
        </Box>
        <Box sx={{ my: 3 }}>
          <NippoForm onSave={handleSaveNippo} />
        </Box>
        <Box sx={{ my: 3 }}>
          <NippoList nippos={nippos} onDelete={handleDeleteNippo} />
        </Box>
        <NotionConfig 
          open={showNotionConfig}
          onClose={() => setShowNotionConfig(false)}
          onConfigured={loadData}
        />
      </Container>
    </ThemeProvider>
  );
};

export default App;
