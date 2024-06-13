import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { onMessage, fetchLikedFormSubmissions, saveLikedFormSubmission } from './service/mockServer';

jest.mock('./service/mockServer', () => ({
  onMessage: jest.fn(),
  saveLikedFormSubmission: jest.fn(),
  fetchLikedFormSubmissions: jest.fn(),
}));

beforeEach(() => {
  // Mock the functions in mockServer.js
  fetchLikedFormSubmissions.mockResolvedValue({
    status: 200,
    formSubmissions: [
      { id: 1, data: { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', liked: true } },
    ],
  });

  saveLikedFormSubmission.mockResolvedValue({
    status: 202,
    message: 'Success!'
  });
});

test('renders header text', async () => {
  await act(async () => {
    render(<App />);
  });
  const heading = screen.getByRole('heading', { name: /toast exercise/i });
  expect(heading).toBeInTheDocument();
});

test('renders initial liked submissions', async () => {
  await act(async () => {
    render(<App />);
  });
  const likedSubmission = await screen.findByText(/john.doe@example.com/i);
  expect(likedSubmission).toBeInTheDocument();
});

test('shows new message toast on new message', async () => {
  const mockMessage = { id: 2, data: { firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@example.com' } };

  // mock onMessage function. it just invokes the callback function for testing
  onMessage.mockImplementation((callback) => callback(mockMessage));

  await act(async () => {
    render(<App />);
  });
  
  const newMessageToast = await screen.findByText(/jane.doe@example.com/i);
  expect(newMessageToast).toBeInTheDocument();
});

test('likes a message and adds to the list', async () => {
  const mockMessage = { id: 2, data: { firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@example.com' } };

  onMessage.mockImplementation((callback) => callback(mockMessage));

  await act(async () => {
    render(<App />);
  });
  
  const likeButton = await screen.findByRole('button', { name: /like/i });
  userEvent.click(likeButton);

  const likedMessage = await waitFor(() => screen.getByText(/jane.doe@example.com/i));
  expect(likedMessage).toBeInTheDocument();
});