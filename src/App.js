import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Snackbar from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import Header from './Header';
import Content from './Content';
import { onMessage, saveLikedFormSubmission, fetchLikedFormSubmissions } from './service/mockServer';

import './styles.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [open, setOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingLike, setLoadingLike] = useState(false);
  const [error, setError] = useState(null); 
  const [highlightedMessageId, setHighlightedMessageId] = useState(null); // for highlighting new added submission

  const fetchMessages = () => {
    setLoading(true);
    fetchLikedFormSubmissions()
      .then((response) => {
        if (response.status === 200) {
          setMessages(response.formSubmissions.reverse()); // display the last one first
        }
      })
      .catch((error) => {
        setError('Error fetching liked form submissions: ' + error.message);
        console.error('Error fetching liked form submissions:', error);
        setErrorOpen(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    const handleMessage = (message) => {
      setCurrentMessage(message);
      setOpen(true);
    };

    onMessage(handleMessage);
    fetchMessages();
    return () => {};
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const handleErrorClose = () => {
    setErrorOpen(false);
  };

  const handleLike = (message) => {
    setLoadingLike(true);
    message.data.liked = true;
    saveLikedFormSubmission(message)
      .then((response) => {
        if (response.status === 202) {
          console.log('Submission saved successfully');
          setMessages((savedMessages) => {
            const newMessages = [message, ...savedMessages];
            return newMessages;
          });
          setHighlightedMessageId(message.id); // Set the highlighted message ID for the newly added submission
          // in case of fetch failing, try to fetch again
          if (error && error.startsWith('Error fetching liked form submissions: ')) {            
            fetchMessages();
          }
        }
      })
      .catch((error) => {
        setError('Error in saving submission: ' + error.message);
        console.error('Error in saving submission:', error);
        setErrorOpen(true);
      })
      .finally(() => {
        setLoadingLike(false);
        setOpen(false);
      });
  };



  return (
    <>
      <Header />
      <Container className="container">
        <Content messages={messages} loading={loading} highlightedMessageId={highlightedMessageId} />
      </Container>
      {currentMessage && (
        <Snackbar
          open={open}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
            <SnackbarContent
              className="snackbar-content"
              message={
                <span>
                  <strong>{currentMessage.data.firstName} {currentMessage.data.lastName}</strong>
                  <br />
                  {currentMessage.data.email}
                </span>
              }
              action={[
                <React.Fragment key="like">
                  <Button 
                    className="action-button"
                    color="primary" 
                    size="small" 
                    onClick={() => handleLike(currentMessage)}
                    disabled={loadingLike}
                  >
                    {loadingLike ? (
                      <CircularProgress size={24} color="primary" />
                    ) : (
                      'LIKE'
                    )}
                  </Button>
                </React.Fragment>,
                <IconButton key="close" aria-label="close" className="icon-button" color="inherit" onClick={handleClose}>
                  <CloseIcon />
                </IconButton>,
              ]}
            />
          </Snackbar>
      )}
      {error && (
        <Snackbar
          open={errorOpen}
          autoHideDuration={6000}
          onClose={handleErrorClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <SnackbarContent
            className="snackbar-error"
            message={error}
            action={[
              <IconButton key="close" aria-label="close" className="icon-button" color="inherit" onClick={handleErrorClose}>
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