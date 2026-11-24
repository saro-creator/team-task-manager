import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from './Dashboard';
import API from '../api';

jest.mock('../api', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  interceptors: {
    request: { use: jest.fn() }
  }
}));

describe('Dashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    localStorage.setItem('user', JSON.stringify({ name: 'Alice' }));
    localStorage.setItem('token', 'valid-token');
  });

  test('renders dashboard header and fetches tasks on mount', async () => {
    API.get.mockResolvedValueOnce({
      data: [
        {
          _id: 'task-1',
          title: 'Design UI',
          description: 'Design mockups',
          priority: 'High',
          status: 'Todo',
          dueDate: '2026-12-01'
        }
      ]
    });

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { name: /team task manager/i })).toBeInTheDocument();
    expect(screen.getByText(/Alice/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(API.get).toHaveBeenCalledWith('/tasks/all');
      expect(screen.getByText('Design UI')).toBeInTheDocument();
      expect(screen.getByText('Design mockups')).toBeInTheDocument();
    });
  });

  test('adds a new task through the form', async () => {
    API.get.mockResolvedValue({ data: [] });
    API.post.mockResolvedValueOnce({ data: { _id: 'task-2', title: 'New Test Task' } });

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/task title/i), { target: { value: 'New Test Task' } });
    fireEvent.change(screen.getByPlaceholderText(/description/i), { target: { value: 'Test Description' } });

    fireEvent.click(screen.getByRole('button', { name: /add task/i }));

    await waitFor(() => {
      expect(API.post).toHaveBeenCalledWith('/tasks/create', {
        title: 'New Test Task',
        description: 'Test Description',
        priority: 'Medium',
        dueDate: ''
      });
    });
  });

  test('handles task deletion', async () => {
    API.get.mockResolvedValueOnce({
      data: [
        {
          _id: 'task-del-1',
          title: 'Task to Delete',
          description: 'Desc',
          priority: 'Low',
          status: 'Todo'
        }
      ]
    });
    API.delete.mockResolvedValueOnce({ data: { message: 'Task delete ho gaya!' } });

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Task to Delete')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /delete/i }));

    await waitFor(() => {
      expect(API.delete).toHaveBeenCalledWith('/tasks/delete/task-del-1');
    });
  });
});
