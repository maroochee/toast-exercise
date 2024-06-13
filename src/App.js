import React, { useEffect, useState, useRef } from 'react';
import Container from '@mui/material/Container';
import Snackbar from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Header from './Header';
import Content from './Content';
import { onMessage, saveLikedFormSubmission, fetchLikedFormSubmissions, deleteLikedFormSubmission } from './service/mockServer';

function App() {
  const [messages, setMessages] = useState([]);
  const [open, setOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // State for error messages

  const observer = useRef();

  useEffect(() => {
    const fetchInitialMessages = () => {
      setLoading(true);
      fetchLikedFormSubmissions(page)
        .then((response) => {
          if (response.status === 200) {
            console.log(response.formSubmissions);        
            setMessages(response.formSubmissions);
          }
        })
        .catch((error) => {
          setError('Error fetching liked form submissions: ' + error.message);
          console.error('Error fetching liked form submissions:', error);
          setErrorOpen(true);
        })
        .finally(() => {
          setLoading(false);
        });;
    };
    const handleMessage = (message) => {
      setCurrentMessage(message);
      setOpen(true);
    };

    onMessage(handleMessage);
    fetchInitialMessages();

    return () => {};
  }, []);

  const fetchMoreMessages = () => {
    if (loading) return;
    setLoading(true);

    fetchLikedFormSubmissions(page+1)
      .then((response) => {
        if (response.status === 200) {
          setMessages((prevMessages) => [...prevMessages, ...response.formSubmissions]);
          setPage((prevPage) => prevPage + 1);
        }
      })
      .catch((error) => {
        setError('Error fetching more liked form submissions:: ' + error.message);
        console.error('Error fetching more liked form submissions:', error);
        setErrorOpen(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleErrorClose = () => {
    setErrorOpen(false);
  };

  const handleLike = (message) => {
    message.data.liked = true;
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
        setError('Error in saving submission: ' + error.message);
        console.error('Error in saving submission:', error);
        setErrorOpen(true);
      });
    setOpen(false);
  };

  const handleDelete = (id) => {
    setMessages((savedMessages) => {
      const newMessages = savedMessages.filter((msg) => msg.id !== id);
      deleteLikedFormSubmission(id)
        .then((response) => {
          if (response.status === 202) {
            console.log('A submission was deleted successfully');
          }
        })
        .catch((error) => {
          setError('Error in deleting a submission: ' + error.message);
          console.error('Error in deleting a submission:', error);
          setErrorOpen(true);
        });
      return newMessages;
    });
  };

  const lastMessageElementRef = (node) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchMoreMessages();
      }
    });
    if (node) observer.current.observe(node);
  };

  return (
    <>
      <Header />
      <Container>
        <Content messages={messages}  onDelete={handleDelete} lastMessageRef={lastMessageElementRef}  />
      </Container>
      {currentMessage && (
        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
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
      {error && (
        <Snackbar
          open={errorOpen}
          autoHideDuration={6000}
          onClose={handleErrorClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <SnackbarContent
            style={{ backgroundColor: '#d32f2f', color: '#fff' }}
            message={error}
            action={[
              <IconButton key="close" aria-label="close" color="inherit" onClick={handleErrorClose}>
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