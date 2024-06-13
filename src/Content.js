import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Content({messages, onDelete, lastMessageRef, loading, loadingDeletes}) {
  return (
    <Box sx={{marginTop: 3}}>
      <Typography variant="h4">Liked Form Submissions</Typography>

      {messages.length === 0 ? (
        <Typography variant="body1" sx={{ fontStyle: 'italic', marginTop: 1 }}>
          No liked submissions yet.
        </Typography>
      ) : (
        <List>
          {messages.map((message, index) => {
            if (messages.length === index + 1) {
              return (
                <ListItem
                  ref={lastMessageRef}
                  key={message.id}
                  sx={{
                    marginTop: 1,
                    backgroundColor: '#f5f5f5',
                    borderRadius: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <ListItemText
                    primary={`${message.data.firstName} ${message.data.lastName}`}
                    secondary={message.data.email}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => onDelete(message.id)}
                      disabled={loadingDeletes[message.id]}
                    >
                      {loadingDeletes[message.id] ? (
                        <CircularProgress size={24} />
                      ) : (
                        <DeleteIcon />
                      )}
                    </IconButton>
                  </Box>
                </ListItem>
              );
            } else {
              return (            
                <ListItem
                  key={message.id}
                  sx={{
                    marginTop: 1,
                    backgroundColor: '#f5f5f5',
                    borderRadius: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <ListItemText
                    primary={`${message.data.firstName} ${message.data.lastName}`}
                    secondary={message.data.email}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => onDelete(message.id)}
                      disabled={loadingDeletes[message.id]}
                    >
                      {loadingDeletes[message.id] ? (
                        <CircularProgress size={24} />
                      ) : (
                        <DeleteIcon />
                      )}
                    </IconButton>
                  </Box>
                </ListItem>
              );
            }
          })}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', padding: 2 }}>
              <CircularProgress />
            </Box>
          )}
        </List>
      )}
    </Box>
  );
}