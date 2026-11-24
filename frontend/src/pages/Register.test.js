import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Register from './Register';
import axios from 'axios';

jest.mock('axios');

describe('Register Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders registration form inputs and button', () => {
    const { container } = render(<Register />);

    expect(screen.getByRole('heading', { name: /create account/i })).toBeInTheDocument();
    expect(container.querySelector('input[name="name"]')).toBeInTheDocument();
    expect(container.querySelector('input[name="email"]')).toBeInTheDocument();
    expect(container.querySelector('input[name="password"]')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  test('submits registration form successfully', async () => {
    axios.post.mockResolvedValueOnce({
      data: { message: 'User ban gaya! Ab login karo.' }
    });

    const { container } = render(<Register />);

    fireEvent.change(container.querySelector('input[name="name"]'), { target: { value: 'Jane' } });
    fireEvent.change(container.querySelector('input[name="email"]'), { target: { value: 'jane@example.com' } });
    fireEvent.change(container.querySelector('input[name="password"]'), { target: { value: 'pass123' } });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
      expect(screen.getByText(/registration successful/i)).toBeInTheDocument();
    });
  });

  test('displays error message on registration failure', async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { message: 'User pehle se maujood hai!' } }
    });

    const { container } = render(<Register />);

    fireEvent.change(container.querySelector('input[name="name"]'), { target: { value: 'Jane' } });
    fireEvent.change(container.querySelector('input[name="email"]'), { target: { value: 'jane@example.com' } });
    fireEvent.change(container.querySelector('input[name="password"]'), { target: { value: 'pass123' } });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByText(/user pehle se maujood hai/i)).toBeInTheDocument();
    });
  });
});
