# 🚀 AI CRM Dashboard

An AI-powered Customer Relationship Management (CRM) application built using the MERN Stack. The platform helps users manage leads, contacts, tasks, and notes while leveraging Google's Gemini AI for intelligent assistance.

## 🌐 Live Demo

**Frontend:**  
https://aicrm-gilt-chi.vercel.app

**Backend API:**  
https://aicrm-pgbh.onrender.com

## 📂 GitHub Repository

https://github.com/anujsharma2301/AICRM

---

## ✨ Features

- 🔐 User Authentication (JWT)
- 👤 User Registration & Login
- 📊 Dashboard Overview
- 📈 Lead Management (Create, Read, Update, Delete)
- 📇 Contact Management
- ✅ Task Management
- 📝 Notes Management
- 🤖 AI-Powered Insights using Google Gemini
- 📉 Analytics Dashboard
- 📱 Responsive User Interface
- 🔒 Protected Routes
- ⚡ RESTful API Architecture

---

## 🛠️ Tech Stack

### Frontend

- React.js
- Vite
- React Router
- Axios
- CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Google Gemini API

### Deployment

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

---

## 📁 Project Structure

```
AICRM
│
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── services
│   ├── utils
│   ├── server.js
│   └── seed.js
│
├── frontend
│   └── AICRMDashboard
│       ├── src
│       ├── public
│       ├── package.json
│       ├── vite.config.js
│       └── vercel.json
│
└── README.md
```

---

## ⚙️ Installation

### Clone the Repository

```bash
git clone https://github.com/anujsharma2301/AICRM.git

cd AICRM
```

---

## Backend Setup

```bash
cd backend

npm install
```

Create a `.env` file inside the backend folder.

```env
PORT=8000

NODE_ENV=development

CLIENT_URL=http://localhost:5173

MONGO_URI=YOUR_MONGODB_URI

JWT_SECRET=YOUR_SECRET_KEY

JWT_EXPIRES_IN=7d

GEMINI_API_KEY=YOUR_GEMINI_API_KEY

GEMINI_MODEL=gemini-2.5-flash
```

Start the backend:

```bash
npm run dev
```

---

## Frontend Setup

```bash
cd frontend/AICRMDashboard

npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:8000/api
```

Run the frontend:

```bash
npm run dev
```

---

## 🚀 Deployment

### Frontend

Deployed using **Vercel**

### Backend

Deployed using **Render**

### Database

Hosted on **MongoDB Atlas**

---

## API Endpoints

### Authentication

```
POST /api/auth/register

POST /api/auth/login
```

### Leads

```
GET /api/leads

POST /api/leads

PUT /api/leads/:id

DELETE /api/leads/:id
```

### Contacts

```
GET /api/contacts

POST /api/contacts
```

### Tasks

```
GET /api/tasks

POST /api/tasks
```

### Notes

```
GET /api/notes

POST /api/notes
```

### AI

```
POST /api/ai
```

### Analytics

```
GET /api/analytics
```

---

## Screenshots

> Add screenshots here.

Example:

```
screenshots/

login.png

dashboard.png

leads.png

contacts.png

analytics.png
```

---

## Future Improvements

- Email Notifications
- File Upload Support
- Role-Based Authentication
- Team Collaboration
- Dark Mode
- Calendar Integration
- Activity Logs
- Real-Time Notifications

---

## Author

**Anuj Sharma**

GitHub:
https://github.com/anujsharma2301

LinkedIn:
(Add your LinkedIn profile here)

---

## License

This project is licensed under the MIT License.

---

⭐ If you found this project useful, consider giving it a star on GitHub!