# 📋 Team Task Manager (MERN Stack)

Ek full-stack **Team Task Manager** web application jo teams aur individuals ko unke daily tasks manage, track, aur organize karne mein madad karta hai. Yeh project **MongoDB, Express.js, React, aur Node.js (MERN)** par bana hai.

---

## 🌐 Live Demo

- **Frontend Live App:** [https://onrender.com](https://onrender.com)
- **Backend API Base URL:** [https://onrender.com](https://onrender.com)

*(Note: Render free tier par hone ki wajah se pehli request mein server wake-up hone mein 30–50 seconds lag sakte hain.)*

---

## 📸 Screenshots

> *(Aap apne Dashboard aur Login page ke screenshots lekar yahan add kar sakte hain)*
> ```markdown
> ![Login Page](./screenshots/login.png)
> ![Dashboard](./screenshots/dashboard.png)
> ```

---

## ✨ Key Features

- **🔐 User Authentication:** JWT (JSON Web Token) aur bcrypt ke saath secure User Registration (Signup) aur Login.
- **🛡️ Protected Routes:** Sirf logged-in users hi apna dashboard aur tasks access kar sakte hain.
- **📝 Complete Task CRUD:**
  - **Create:** Naye tasks banayein title, description, priority (`Low`, `Medium`, `High`), aur due date ke saath.
  - **Read:** Sabhi tasks ko ek clean dashboard par dekhein.
  - **Update:** Task ka status (`Todo`, `In Progress`, `Completed`) turant update karein.
  - **Delete:** Completed ya unwanted tasks ko delete karein.
- **☁️ Cloud Ready:** Backend aur Frontend dono Render par deploy karne ke liye configured hain.

---

## 🛠️ Tech Stack

- **Frontend:** React.js, React Router DOM, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas (Mongoose ODM)
- **Authentication:** JSON Web Tokens (JWT), Bcrypt.js

---

## 📂 Project Structure

```text
team-task-manager/
├── backend/
│   ├── middleware/
│   │   └── auth.js          # JWT verification middleware
│   ├── models/
│   │   ├── User.js          # User schema
│   │   └── Task.js          # Task schema
│   ├── routes/
│   │   ├── auth.js          # Login & Register routes
│   │   └── tasks.js         # Task CRUD routes
│   ├── .env                 # Environment variables
│   ├── server.js            # Entry point for backend
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── _redirects       # Render SPA routing config
    ├── src/
    │   ├── pages/
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   └── Dashboard.js
    │   ├── api.js           # Axios instance with JWT interceptor
    │   ├── App.js           # Routing & PrivateRoute setup
    │   └── index.js
    └── package.json
```

---

## 🚀 Local Setup Kaise Karein?

Is project ko apne computer par chalane ke liye niche diye gaye steps follow karein:

### 1. Repository Clone Karein
```bash
git clone https://github.com
cd team-task-manager
```

### 2. Backend Setup
```bash
cd backend
npm install
```
`backend` folder ke andar ek `.env` file banayein aur usme yeh details daalein:
```env
PORT=5000
MONGO_URI=aapka_mongodb_atlas_connection_string
JWT_SECRET=aapka_secret_key
```
Backend server start karein:
```bash
node server.js
```

### 3. Frontend Setup
Naya terminal kholein aur `frontend` folder mein jaayein:
```bash
cd frontend
npm install
npm start
```
App browser mein `http://localhost:3000` par khul jayega.

---

## 🔌 API Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Naya user account banayein | No |
| `POST` | `/api/auth/login` | User login aur JWT token prapt karein | No |
| `GET` | `/api/tasks/all` | Sabhi tasks ki list dekhein | Yes |
| `POST` | `/api/tasks/create` | Naya task add karein | Yes |
| `PUT` | `/api/tasks/update/:id` | Task ka status ya details update karein | Yes |
| `DELETE` | `/api/tasks/delete/:id` | Task ko delete karein | Yes |

---

## 👨‍💻 Author

**Saro**  
GitHub: [@saro-creator](https://github.com)
