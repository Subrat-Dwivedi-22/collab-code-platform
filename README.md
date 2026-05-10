# CodeSync

A real-time collaborative coding platform built with the MERN stack, Socket.io, Monaco Editor, and AWS-ready architecture.

CodeSync allows developers to collaborate in shared coding rooms, communicate in real time, execute code online, and manage collaborative sessions with persistent room state and role-based access control.

---

# Features

## Authentication & Security

- JWT Authentication
- Protected Routes
- Secure API Access
- Role-Based Room Permissions

## Real-Time Collaboration

- Live collaborative code editing
- Real-time room chat
- Online user presence tracking
- Shared room synchronization using Socket.io

## Collaborative Room System

- Create and join coding rooms
- Persistent room history
- Admin/member roles
- Admin-only room deletion
- Room-based collaboration architecture

## Code Editor

- Monaco Editor integration
- Multi-language support
- Real-time code synchronization
- Persistent room code state
- Debounced auto-save optimization

## Code Execution Engine

- Execute code directly from editor
- Multi-language execution using JDoodle API
- Output console integration
- Shared collaborative execution workflow

## UI & UX

- Modern responsive interface
- Material UI design system
- Dark mode support
- Landing page with collaborative editor preview
- Developer-focused terminal-inspired branding

---

# Tech Stack

## Frontend

- React
- Vite
- Material UI (MUI)
- Monaco Editor
- Socket.io Client
- React Router DOM
- Axios

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- Socket.io
- JWT Authentication

## APIs & Services

- JDoodle Code Execution API
- MongoDB Atlas

## Deployment Ready

- AWS EC2
- CloudFront
- Nginx
- Vercel (Frontend Hosting)

---

# Architecture Overview

```txt
Frontend (React + Monaco)
        ↓
Socket.io Real-Time Layer
        ↓
Node.js + Express Backend
        ↓
MongoDB Atlas Persistence
        ↓
JDoodle Execution Engine
```

---

# Performance Optimizations

- Debounced database persistence
- Real-time socket-based synchronization
- Optimized room state management
- Reduced unnecessary MongoDB writes
- Efficient online user tracking using in-memory state

---

# Screenshots

## Landing Page

Add screenshot here

## Collaborative Editor

Add screenshot here

## Rooms Dashboard

Add screenshot here

---

# Getting Started

## Clone Repository

```bash
git clone https://github.com/your-username/codesync.git
```

---

# Frontend Setup

```bash
cd client
npm install
npm run dev
```

---

# Backend Setup

```bash
cd server
npm install
npm run dev
```

---

# Environment Variables

Create a `.env` file inside `server/`

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JDOODLE_CLIENT_ID=your_client_id
JDOODLE_CLIENT_SECRET=your_client_secret
```

---

# Future Improvements

- Video interview mode
- Shared execution output synchronization
- Docker-based isolated execution sandbox
- AI coding assistant integration
- Collaborative cursor presence
- Kubernetes deployment

---

# Acknowledgements

- Monaco Editor
- Socket.io
- Material UI
- JDoodle API
- MongoDB Atlas

---

# UI Template Notice

Parts of the landing page UI were built using Material UI templates and then customized and extended for the CodeSync platform.

---

# Author

Subrat Dwivedi

Built as a full-stack collaborative coding platform project for internship and portfolio showcase.
