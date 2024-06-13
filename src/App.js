import React, { useEffect, useState, useRef } from 'react';
import Container from '@mui/material/Container';
import Snackbar from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import Header from './Header';
import Content from './Content';
import { onMessage, saveLikedFormSubmission, fetchLikedFormSubmissions, deleteLikedFormSubmission } from './service/mockServer';

function App() {
  const [fetchedMessages, seFetchedMessages] = useState([]);
  const [newMessages, setNewMessages] = useState([]);
  const [open, setOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(null);
  const [page, setPage] = useState(1);
  const [lastFetchedCount, setLastFetchedCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingLike, setLoadingLike] = useState(false);
  const [loadingDeletes, setLoadingDeletes] = useState({});
  const [error, setError] = useState(null); 

  const observer = useRef();

  // TODO: implement retry logic in fetching messages
  //       both in initial fetching and additional fetching

  useEffect(() => {
    const fetchInitialMessages = () => {
      setLoading(true);
      fetchLikedFormSubmissions(page)
        .then((response) => {
          if (response.status === 200) {
            seFetchedMessages(response.formSubmissions);
            setLastFetchedCount(response.formSubmissions.length);
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
    const handleMessage = (message) => {
      setCurrentMessage(message);
      setOpen(true);
    };

    onMessage(handleMessage);
    fetchInitialMessages();

    return () => {};
  }, []);

  const fetchMoreMessages = () => {
    if (loading || !lastFetchedCount) return;
    setLoading(true);

    fetchLikedFormSubmissions(page+1)
      .then((response) => {
        if (response.status === 200) {
          seFetchedMessages((prevMessages) => [...prevMessages, ...response.formSubmissions]);
          if (response.formSubmissions && response.formSubmissions.length > 0) {
            setPage((prevPage) => prevPage + 1);
          } else {
            setLastFetchedCount(response.formSubmissions.length);
          }
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
    setLoadingLike(true);
    message.data.liked = true;
    saveLikedFormSubmission(message)
      .then((response) => {
        if (response.status === 202) {
          console.log('Submission saved successfully');
          setLastFetchedCount(lastFetchedCount+1);
          setNewMessages((savedMessages) => {
            const newMessages = [message, ...savedMessages];
            return newMessages;
          });
          // seFetchedMessages((savedMessages) => {
          //   const newMessages = [...savedMessages, message];
          //   return newMessages;
          // });
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

  const handleDelete = (id) => {
    setLoadingDeletes((prev) => ({ ...prev, [id]: true }));
    deleteLikedFormSubmission(id)
      .then((response) => {
        if (response.status === 202) {
          console.log('A submission was deleted successfully');
          seFetchedMessages((savedMessages) => savedMessages.filter((msg) => msg.id !== id))
          setNewMessages((savedMessages) => savedMessages.filter((msg) => msg.id !== id));;
        }
      })
      .catch((error) => {
        setError('Error in deleting a submission: ' + error.message);
        console.error('Error in deleting a submission:', error);
        setErrorOpen(true);
      })
      .finally(() => {
        setLoadingDeletes((prev) => {
          const newState = { ...prev };
          delete newState[id];
          return newState;
        });
      });
      // setNewMessages((savedMessages) => savedMessages.filter((msg) => msg.id !== id));
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

  // Merge new and fetched messages
  const allMessages = [...fetchedMessages.filter(
    fetchedMsg => !newMessages.some(newMsg => newMsg.id === fetchedMsg.id)
  ), ...newMessages];



  return (
    <>
      <Header />
      <Container>
        <Content messages={allMessages}  onDelete={handleDelete} lastMessageRef={lastMessageElementRef} loading={loading} loadingDeletes={loadingDeletes}  />
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
                <React.Fragment key="like">
                  <Button 
                    color="primary" 
                    size="small" 
                    onClick={() => handleLike(currentMessage)}
                    disabled={loadingLike === true}
                  >
                    {loadingLike === true ? (
                      <CircularProgress size={24} color="primary" />
                    ) : (
                      'LIKE'
                    )}
                  </Button>
                </React.Fragment>,
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