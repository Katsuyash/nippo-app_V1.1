import React, { useState } from 'react';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
} from '@mui/material';
import { Send } from '@mui/icons-material';
import { format } from 'date-fns';
import type { Nippo } from '../types/nippo';

interface NippoFormProps {
  onSave: (nippo: Omit<Nippo, 'id' | 'createdAt'>) => void;
}

const NippoForm: React.FC<NippoFormProps> = ({ onSave }) => {
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      return;
    }

    onSave({
      date,
      title: title.trim(),
      content: content.trim(),
    });

    // Reset form
    setTitle('');
    setContent('');
    setDate(format(new Date(), 'yyyy-MM-dd'));
    
    // Show success message
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <Card elevation={2}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          新しい日報を作成
        </Typography>
        
        {showSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            日報を保存しました！
          </Alert>
        )}
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            type="date"
            label="日付"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          
          <TextField
            label="タイトル"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
            placeholder="今日の成果や学びを一言で..."
          />
          
          <TextField
            label="本文"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            fullWidth
            required
            multiline
            rows={6}
            sx={{ mb: 3 }}
            placeholder="今日の活動内容、成果、学び、明日の計画などを記録してください..."
          />
          
          <Button
            type="submit"
            variant="contained"
            size="large"
            startIcon={<Send />}
            disabled={!title.trim() || !content.trim()}
            fullWidth
          >
            日報を保存
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default NippoForm;
