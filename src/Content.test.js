import React from 'react';
import { render, screen } from '@testing-library/react';
import Content from './Content';

describe('Content Component', () => {
  test('renders no liked submissions message when messages are empty', () => {
    render(<Content messages={[]} loading={false} highlightedMessageId={null} />);
    const noSubmissionsMessage = screen.getByText(/no liked submissions yet/i);
    expect(noSubmissionsMessage).toBeInTheDocument();
  });

  test('renders a list of liked submissions', () => {
    const messages = [
      { id: 1, data: { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' } },
      { id: 2, data: { firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@example.com' } },
    ];
    render(<Content messages={messages} loading={false} highlightedMessageId={null} />);

    const firstMessage = screen.getByText(/john.doe@example.com/i);
    const secondMessage = screen.getByText(/jane.doe@example.com/i);

    expect(firstMessage).toBeInTheDocument();
    expect(secondMessage).toBeInTheDocument();
  });

  test('shows loading spinner when loading is true', () => {
    render(<Content messages={[]} loading={true} highlightedMessageId={null} />);
    const spinner = screen.getByRole('progressbar');
    expect(spinner).toBeInTheDocument();
  });

  test('highlights the new submission', () => {
    const messages = [
      { id: 1, data: { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' } },
      { id: 2, data: { firstName: 'Jane', lastName: 'Doe', email: 'jane.doe@example.com' } }
    ];
    render(<Content messages={messages} loading={false} highlightedMessageId={1} />);

    const highlightedMessage = screen.getByText(/john.doe@example.com/i).closest('.list-item');
    expect(highlightedMessage).toHaveClass('new-submission');
  });
});