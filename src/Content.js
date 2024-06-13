import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import CircularProgress from '@mui/material/CircularProgress';

export default function Content({messages, loading, highlightedMessageId}) {
  return (
    <Box className="container">
      <Typography className="heading">Liked Form Submissions</Typography>
      {messages.length === 0 ? (
        <Typography  className="no-submissions">
          No liked submissions yet.
        </Typography>
      ) : (
        <List>
          {messages.map((message, index) => (            
                <ListItem
                  key={message.id}
                  className={`list-item ${highlightedMessageId === message.id ? 'new-submission' : ''}`}
                >
                  <ListItemText
                    primary={`${message.data.firstName} ${message.data.lastName}`}
                    secondary={message.data.email}
                  />
                </ListItem>
          ))}
        </List>
      )}
      {loading && (
        <Box className="progress">
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
}