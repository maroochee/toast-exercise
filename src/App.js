import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Header from './Header';
import Content from './Content';
import { onMessage, saveLikedFormSubmission, fetchLikedFormSubmissions } from './service/mockServer';

function App() {
  const [messages, setMessages] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(null);

  useEffect(() => {
    const handleMessage = (message) => {
      setMessages((savedMessages) => {
        const newMessages = [...savedMessages, message];
        localStorage.setItem('formSubmissions', JSON.stringify(newMessages));
        return newMessages;
      });
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
    saveLikedFormSubmission(message);
    setMessages((savedMessages) => {
      const newMessages = [...savedMessages, message];
      return newMessages;
    });
    saveLikedFormSubmission(message)
    .then((response) => {
      console.log('respons status', response.status)
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
    </>
  );
}

export default App;
