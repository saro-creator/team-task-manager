const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, './.env') });

console.log("Cheking DB URL:", process.env.MONGO_URI);
app.use(cors({
  origin: [
    'https://team-task-manager-1-2i9z.onrender.com', // Aapka live domain
    'http://localhost:3000',                        // Aapka local development
    'http://localhost:5173'                         // Agar aap Vite use kar rahe hain
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

const authRoutes = require('./routes/auth'); // Check kijiye path sahi hai
app.use('/api/auth', authRoutes);

app.get('/',(req,res) => {
    res.send('server is start');
});

const port=5000;

mongoose.connect(process.env.MONGO_URI)

  .then(() => console.log("MongoDB se connection jud gaya! ✅"))
  .catch((err) => console.log("DB Connection Error: ", err));

// Routes use karo
app.use('/api/auth', require('./routes/auth'));
// Tasks ke liye rasta
app.use('/api/tasks', require('./routes/tasks'));

app.get('/', (req, res) => {
  res.send('Server aur Database dono set hain!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.listen(port,()=>{
    console.log(`server is run at port no ${port} par`);
});