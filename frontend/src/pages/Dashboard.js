import React, { useState, useEffect } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Saare tasks load karne ke liye
  const fetchTasks = async () => {
    try {
      const res = await API.get('/tasks/all');
      setTasks(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        handleLogout();
      }
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Naya task add karne ke liye
  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      await API.post('/tasks/create', { title, description, priority, dueDate });
      setTitle('');
      setDescription('');
      setPriority('Medium');
      setDueDate('');
      fetchTasks(); // List refresh karein
    } catch (err) {
      alert('Task add nahi ho paya!');
    }
  };

  // Task ka status change karne ke liye
  const handleStatusChange = async (id, newStatus) => {
    try {
      await API.put(`/tasks/update/${id}`, { status: newStatus });
      fetchTasks();
    } catch (err) {
      alert('Status update nahi hua!');
    }
  };

  // Task delete karne ke liye
  const handleDelete = async (id) => {
    try {
      await API.delete(`/tasks/delete/${id}`);
      fetchTasks();
    } catch (err) {
      alert('Delete fail ho gaya!');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '30px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
        <h2>📋 Team Task Manager</h2>
        <div>
          <span style={{ marginRight: '15px' }}>👋 Hi, <b>{user.name || 'User'}</b></span>
          <button onClick={handleLogout} style={{ padding: '6px 12px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      </div>

      {/* Add Task Form */}
      <form onSubmit={handleAddTask} style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', marginTop: '20px' }}>
        <h3>➕ Naya Task Banayein</h3>
        <input
          type="text"
          placeholder="Task Title *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ width: '100%', padding: '8px', marginBottom: '10px', boxSizing: 'border-box' }}
        />
        <textarea
          placeholder="Description (Optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '10px', boxSizing: 'border-box' }}
        />
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <select value={priority} onChange={(e) => setPriority(e.target.value)} style={{ padding: '8px', flex: 1 }}>
            <option value="Low">Low Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="High">High Priority</option>
          </select>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            style={{ padding: '8px', flex: 1 }}
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Add Task
        </button>
      </form>

      {/* Task List */}
      <div style={{ marginTop: '30px' }}>
        <h3>📌 Aapke Tasks ({tasks.length})</h3>
        {tasks.length === 0 ? <p>Abhi koi task nahi hai.</p> : null}

        {tasks.map((task) => (
          <div key={task._id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ margin: '0 0 5px 0' }}>
                {task.title} 
                <span style={{ fontSize: '12px', marginLeft: '10px', padding: '2px 8px', borderRadius: '10px', background: task.priority === 'High' ? '#ffcccc' : '#e2e3e5' }}>
                  {task.priority}
                </span>
              </h4>
              <p style={{ margin: '0 0 8px 0', color: '#555' }}>{task.description}</p>
              <small style={{ color: '#888' }}>
                Status: <b>{task.status}</b> {task.dueDate && `| Due: ${new Date(task.dueDate).toLocaleDateString()}`}
              </small>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(task._id, e.target.value)}
                style={{ padding: '5px' }}
              >
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              <button
                onClick={() => handleDelete(task._id)}
                style={{ padding: '5px 10px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
