import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Collapse,
} from '@mui/material';
import {
  Delete,
  ExpandMore,
  ExpandLess,
  Link as LinkIcon,
  Search,
} from '@mui/icons-material';
import { format } from 'date-fns';
import type { Nippo } from '../types/nippo';

interface NippoListProps {
  nippos: Nippo[];
  onDelete: (id: string) => void;
}

const NippoList: React.FC<NippoListProps> = ({ nippos, onDelete }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [nippoToDelete, setNippoToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNippos = nippos.filter(nippo => 
    nippo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    nippo.content.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleExpandClick = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleDeleteClick = (id: string) => {
    setNippoToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (nippoToDelete) {
      onDelete(nippoToDelete);
      setDeleteDialogOpen(false);
      setNippoToDelete(null);
      setExpandedId(null);
    }
  };

  if (nippos.length === 0) {
    return (
      <Card elevation={1}>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            まだ日報がありません
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            上のフォームから最初の日報を作成してみましょう！
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        日報一覧 ({nippos.length}件)
      </Typography>
      
      <TextField
        label="検索"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
        }}
        placeholder="タイトルや本文で検索..."
      />
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {filteredNippos.map((nippo) => (
          <Card key={nippo.id} elevation={1}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="div">
                    {nippo.title}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1, mb: 1 }}>
                    <Chip 
                      label={format(new Date(nippo.date), 'yyyy年MM月dd日')}
                      size="small"
                      variant="outlined"
                    />
                    {nippo.notionPageId && (
                      <Chip 
                        icon={<LinkIcon />}
                        label="Notion"
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    )}
                  </Box>
                </Box>
                <Box>
                  <IconButton
                    onClick={() => handleExpandClick(nippo.id)}
                    size="small"
                  >
                    {expandedId === nippo.id ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteClick(nippo.id)}
                    size="small"
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </Box>
              
              <Collapse in={expandedId === nippo.id} timeout="auto" unmountOnExit>
                <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
                    {nippo.content}
                  </Typography>
                </Box>
              </Collapse>
            </CardContent>
          </Card>
        ))}
      </Box>
      
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>日報を削除</DialogTitle>
        <DialogContent>
          <Typography>
            この日報を削除しますか？この操作は元に戻せません。
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>キャンセル</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            削除
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NippoList;
