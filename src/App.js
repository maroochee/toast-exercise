import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Snackbar from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Header from './Header';
import Content from './Content';
import { onMessage, saveLikedFormSubmission, fetchLikedFormSubmissions } from './service/mockServer';

function App() {
  const [messages, setMessages] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(null);

  useEffect(() => {
    const handleMessage = (message) => {
      setCurrentMessage(message);
      setOpen(true);
    };

    onMessage(handleMessage);

    // Fetch liked form submissions on component mount
    fetchLikedFormSubmissions()
    .then((response) => {
      if (response.status === 200) {
        console.log(response.formSubmissions);        
        setMessages(response.formSubmissions);
      }
    })
    .catch((error) => {
      console.error('Error fetching liked form submissions:', error);
    });


    return () => {};
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const handleLike = (message) => {
    setMessages((savedMessages) => {
      const newMessages = [...savedMessages, message];
      return newMessages;
    });
    saveLikedFormSubmission(message)
      .then((response) => {
        if (response.status === 202) {
          console.log('Submission saved successfully');
        }
      })
      .catch((error) => {
        console.error('Error in saving submission:', error);
      });
    setOpen(false);
  };

  return (
    <>
      <Header />
      <Container>
        <Content messages={messages} />
      </Container>
      {currentMessage && (
        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          message={currentMessage.data.email}
          >
            <SnackbarContent
              style={{ backgroundColor: '#333', color: '#fff' }}
              message={
                <span>
                  <strong>{currentMessage.data.firstName} {currentMessage.data.lastName}</strong>
                  <br />
                  {currentMessage.data.email}
                </span>
              }
              action={[
                <Button key="like" color="secondary" size="small" onClick={() => handleLike(currentMessage)}>
                  LIKE
                </Button>,
                <IconButton key="close" aria-label="close" color="inherit" onClick={handleClose}>
                  <CloseIcon />
                </IconButton>,
              ]}
            />
          </Snackbar>
      )}
    </>
  );
}

export default App;