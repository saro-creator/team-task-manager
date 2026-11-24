import { render, screen } from '@testing-library/react';
import App from './App';

describe('Team Task Manager App', () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.pushState({}, 'Home', '/');
  });

  test('renders login page by default when not logged in', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('renders registration link on login page', () => {
    render(<App />);
    const registerLink = screen.getByRole('link', { name: /register \/ signup/i });
    expect(registerLink).toBeInTheDocument();
    expect(registerLink).toHaveAttribute('href', '/register');
  });

  test('renders dashboard when user token is present and navigates to /dashboard', () => {
    localStorage.setItem('token', 'fake-jwt-token');
    localStorage.setItem('user', JSON.stringify({ name: 'Test User' }));
    window.history.pushState({}, 'Dashboard', '/dashboard');

    render(<App />);
    expect(screen.getByRole('heading', { name: /team task manager/i })).toBeInTheDocument();
    expect(screen.getByText(/Test User/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });
});
