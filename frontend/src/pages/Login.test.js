import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';
import API from '../api';

jest.mock('../api', () => ({
  post: jest.fn(),
  interceptors: {
    request: { use: jest.fn() }
  }
}));

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('renders login form with fields and buttons', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { name: /^login$/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^login$/i })).toBeInTheDocument();
  });

  test('updates input values when typing', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);

    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('user@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  test('handles successful login and stores token in localStorage', async () => {
    API.post.mockResolvedValueOnce({
      data: {
        token: 'test-token',
        user: { name: 'John Doe', email: 'john@example.com' }
      }
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'secret' } });
    fireEvent.click(screen.getByRole('button', { name: /^login$/i }));

    await waitFor(() => {
      expect(API.post).toHaveBeenCalledWith('/auth/login', {
        email: 'john@example.com',
        password: 'secret'
      });
      expect(localStorage.getItem('token')).toBe('test-token');
      expect(screen.getByText(/login successful/i)).toBeInTheDocument();
    });
  });

  test('handles failed login and displays error message', async () => {
    API.post.mockRejectedValueOnce({
      response: { data: { message: 'Galat password!' } }
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'wrongpass' } });
    fireEvent.click(screen.getByRole('button', { name: /^login$/i }));

    await waitFor(() => {
      expect(screen.getByText(/galat password/i)).toBeInTheDocument();
    });
  });
});
