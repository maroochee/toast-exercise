import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function Content({messages}) {
  return (
    <Box sx={{marginTop: 3}}>
      <Typography variant="h4">Liked Form Submissions</Typography>

      {messages.length === 0 ? (
        <Typography variant="body1" sx={{ fontStyle: 'italic', marginTop: 1 }}>
          No liked submissions yet.
        </Typography>
      ) : (
        <Box>
          {messages.map((message, index) => (
            <Typography key={message.id} variant="body1" sx={{ marginTop: 1 }}>
              {message.data.email}  
            </Typography>
          ))}
        </Box>
      )}
    </Box>
  );
}
