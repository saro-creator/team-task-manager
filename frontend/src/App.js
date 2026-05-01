
import React, { useState, useEffect } from 'react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Tasks fetch karne ka function
  const getTasks = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/tasks/all');
      const data = await res.json();
      setTasks(data);
    } catch (err) { console.log("Error fetching tasks:", err); }
  };

  useEffect(() => {
    if (isLoggedIn) getTasks();
  }, [isLoggedIn]);

  // Naya task add karne ka function
  const handleAddTask = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:5000/api/tasks/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: taskTitle, status: 'Todo' })
    });
    setTaskTitle('');
    getTasks(); // List refresh karo
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      setIsLoggedIn(true);
    } else { alert(data.message); }
  };

  if (!isLoggedIn) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <h2>Login - Team Task Manager</h2>
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} /><br/><br/>
          <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} /><br/><br/>
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial' }}>
      <h1>Dashboard 📊</h1>
      
      {/* Task Add Karne ka Form (Sirf Admin ke liye hota hai, abhi humne sabke liye rakha hai) */}
      <div style={{ marginBottom: '30px', padding: '15px', background: '#f4f4f4' }}>
        <h3>+ Naya Task Dalein</h3>
        <form onSubmit={handleAddTask}>
          <input 
            value={taskTitle} 
            onChange={(e) => setTaskTitle(e.target.value)} 
            placeholder="Task ka naam..." 
            style={{ padding: '8px', width: '250px' }}
          />
          <button type="submit" style={{ marginLeft: '10px', padding: '8px 15px' }}>Add Task</button>
        </form>
      </div>

      <h3>Tasks ki List:</h3>
      <div style={{ display: 'grid', gap: '10px' }}>
        {tasks.map(t => (
          <div key={t._id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
            <strong>{t.title}</strong> - <span style={{ color: 'blue' }}>{t.status}</span>
          </div>
        ))}
      </div>
      
      <button onClick={() => { localStorage.removeItem('token'); setIsLoggedIn(false); }} style={{ marginTop: '20px', color: 'red' }}>Logout</button>
    </div>
  );
}

export default App;