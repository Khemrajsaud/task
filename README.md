# Full-Stack Real-Time Chat App

A modern, responsive, and seamless real-time chat application built using the complete MERN stack (MongoDB, Express.js, React, Node.js) combined with Socket.IO for real-time bidirectional event-based communication.

## Features

*   **Authentication & Authorization:** Secure User Registration and Login via JWT and bcryptjs.
*   **Real-time Communication:** Instant message broadcasting and reception with Socket.IO.
*   **Persistent Chat History:** Messages are safely stored and retrieved from MongoDB.
*   **Live Dashboard Stats:** Real-time statistics tracking total registered users and total system messages sent.
*   **Dynamic Interactive UI:** A stunning, ultra-modern dark theme built with Tailwind CSS, fully responsive across diverse screen sizes.
*   **Online State and System Alerts:** Live alerts informing when users join the lobby.

## Project Structure
The repository is split into two independent domains:

*   `/backend` - Node.js Express server running the REST API and Socket.IO hub.
*   `/frontend` - React application bootstrapped with Vite and Tailwind CSS.

## Prerequisites
*   Node.js (v18+)
*   MongoDB (Local installation or MongoDB Atlas Connection URI)

## Environment Variables

### Backend
1. Navigate to `/backend`.
2. Rename `.env.example` to `.env`.
3. Update the variables to map to your system:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/chat-app
JWT_SECRET=your_super_secret_jwt_key
```

### Frontend
1. Navigate to `/frontend`.
2. Rename `.env.example` to `.env`.
3. Ensure the backend maps properly:
```env
VITE_API_URL=http://localhost:5000/api
```

## Installation & Setup

### 1. Backend Setup
Open a terminal and execute the following:
```bash
cd backend
npm install
npm run dev
```

### 2. Frontend Setup
Open a secondary terminal and execute the following:
```bash
cd frontend
npm install
npm run dev
```

## Usage

1.  Navigate to the Local URL provided by Vite (Usually `http://localhost:5173`).
2.  **Sign Up** for a brand new account via the `/register` portal.
3.  Ensure your backend is running.
4.  Once authorized, you will be redirected to the Global Chat area.
5.  Open a secondary private window or browser to test real-time chat between two accounts!

## Tech Stack
*   **Frontend:** React (Vite), React Router v6, Tailwind CSS, Axios, Socket.IO Client.
*   **Backend:** Node.js, Express, MongoDB (Mongoose), Socket.IO, JWT Auth.
