import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Alert,
  Link,
} from '@mui/material';
import { notionService } from '../services/notionService';

interface NotionConfigProps {
  open: boolean;
  onClose: () => void;
  onConfigured: () => void;
}

const NotionConfig: React.FC<NotionConfigProps> = ({ open, onClose, onConfigured }) => {
  const [token, setToken] = useState('');
  const [databaseId, setDatabaseId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (open) {
      // Load existing values
      const existingToken = localStorage.getItem('notion_token') || '';
      const existingDatabaseId = localStorage.getItem('notion_database_id') || '';
      setToken(existingToken);
      setDatabaseId(existingDatabaseId);
      setError('');
      setSuccess(false);
    }
  }, [open]);

  const handleSave = () => {
    setError('');
    
    if (!token.trim()) {
      setError('Notion APIトークンを入力してください');
      return;
    }
    
    if (!databaseId.trim()) {
      setError('データベースIDを入力してください');
      return;
    }

    try {
      notionService.setCredentials(token.trim(), databaseId.trim());
      setSuccess(true);
      setTimeout(() => {
        onConfigured();
        onClose();
      }, 1500);
    } catch (err) {
      setError('設定の保存に失敗しました');
    }
  };

  const handleClose = () => {
    setError('');
    setSuccess(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Notion連携設定</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          日報をNotionデータベースに自動保存する機能を設定できます。
        </Typography>
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            設定が保存されました！
          </Alert>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            1. Notion APIトークンの取得
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            <Link href="https://www.notion.so/my-integrations" target="_blank" rel="noopener">
              Notion Integrations
            </Link> で新しいインテグレーションを作成し、APIトークンを取得してください。
          </Typography>
        </Box>
        
        <TextField
          label="Notion APIトークン"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
          placeholder="secret_xxxxxxxxxxxxxxx..."
          type="password"
        />
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            2. データベースIDの取得
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            日報を保存するNotionデータベースのIDを入力してください。
            データベースにはインテグレーションへのアクセス権限を付与してください。
          </Typography>
        </Box>
        
        <TextField
          label="データベースID"
          value={databaseId}
          onChange={(e) => setDatabaseId(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
          placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
        />
        
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            データベースには以下のプロパティが必要です：
            <br />• Name (タイトル)
            <br />• Date (日付)
            <br />• Title (リッチテキスト)
          </Typography>
        </Alert>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>キャンセル</Button>
        <Button onClick={handleSave} variant="contained" disabled={success}>
          保存
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NotionConfig;