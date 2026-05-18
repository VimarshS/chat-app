# VibeChat 💬

> A real-time full-stack chat application — built for instant, seamless one-on-one conversations.

---

## Overview

VibeChat is a full-stack messaging application that allows users to register, find other users, and exchange text messages and images in real time. It solves the need for a clean, self-hostable chat platform with persistent message history, live online presence indicators, and unread message tracking — all within a modern, blurred-glass UI.

The application is structured as two separate deployable units: a **React + Vite** frontend and an **Express + Socket.IO** backend, both configured for deployment on Vercel.

---

## Features

- **User Authentication** — Secure sign-up and login with bcrypt-hashed passwords and JWT-based session management
- **Two-step Sign-Up Flow** — Collects name/email/password first, then prompts for a bio on a second screen
- **Real-time Messaging** — Bidirectional instant messaging via Socket.IO; messages are pushed to the receiver's socket the moment they are sent
- **Image Sharing** — Send images in chat; files are read as base64 on the client and uploaded to Cloudinary on the backend; Cloudinary URLs are stored in MongoDB
- **Online Presence** — A live `userSocketMap` on the server tracks connected sockets; all clients receive updated online user lists on every connect/disconnect event
- **Unread Message Badges** — The sidebar shows a per-user unread count, computed server-side and decremented when a conversation is opened
- **Read Receipts** — Messages are marked `seen: true` in MongoDB when fetched or when a real-time message arrives while the conversation is active
- **User Search** — Client-side filtering of the user list by full name in the sidebar
- **Profile Management** — Users can update their display name, bio, and profile picture; images are uploaded to Cloudinary
- **Right Sidebar Media Panel** — Displays a scrollable grid of all images exchanged in the current conversation, each clickable to open full-size
- **Persistent Sessions** — JWT token is stored in `localStorage` and reattached to every Axios request on page reload; socket is reconnected automatically
- **Responsive Layout** — Three-column grid (sidebar / chat / right panel) collapses cleanly on mobile; the sidebar hides when a conversation is active on small screens
- **Toast Notifications** — `react-hot-toast` used for all success and error feedback

---

## Tech Stack

### Frontend
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white&style=flat-square)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white&style=flat-square)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white&style=flat-square)
![React Router](https://img.shields.io/badge/React_Router-7-CA4245?logo=reactrouter&logoColor=white&style=flat-square)
![Axios](https://img.shields.io/badge/Axios-1.x-5A29E4?logo=axios&logoColor=white&style=flat-square)
![Socket.IO Client](https://img.shields.io/badge/Socket.IO_Client-4.x-010101?logo=socketdotio&logoColor=white&style=flat-square)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-ESM-339933?logo=nodedotjs&logoColor=white&style=flat-square)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white&style=flat-square)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.x-010101?logo=socketdotio&logoColor=white&style=flat-square)

### Database
![MongoDB](https://img.shields.io/badge/MongoDB_Atlas-Mongoose_9-47A248?logo=mongodb&logoColor=white&style=flat-square)

### Authentication
![JWT](https://img.shields.io/badge/JWT-jsonwebtoken_9-000000?logo=jsonwebtokens&logoColor=white&style=flat-square)
![bcryptjs](https://img.shields.io/badge/bcryptjs-3.x-lightgrey?style=flat-square)

### Media Storage
![Cloudinary](https://img.shields.io/badge/Cloudinary-SDK_2-3448C5?logo=cloudinary&logoColor=white&style=flat-square)

### Deployment
![Vercel](https://img.shields.io/badge/Vercel-Client_%26_Server-000000?logo=vercel&logoColor=white&style=flat-square)

---

## Project Structure

```
chat-app/
├── client/                        # React frontend (Vite)
│   ├── context/
│   │   ├── AuthContext.jsx        # Auth state, JWT, socket connection, login/logout
│   │   └── ChatContext.jsx        # Message state, user list, send/receive logic
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx      # Combined sign-up / login form (two-step)
│   │   │   ├── HomePage.jsx       # Main 3-column layout: Sidebar + Chat + RightSidebar
│   │   │   └── ProfilePage.jsx    # Edit name, bio, and profile picture
│   │   ├── components/
│   │   │   ├── Sidebar.jsx        # User list, search, online status, unread badges
│   │   │   ├── ChatContainer.jsx  # Message thread, text + image sending, auto-scroll
│   │   │   └── RightSidebar.jsx   # Selected user info, media gallery, logout
│   │   ├── assets/
│   │   │   └── assets.js          # Centralised asset imports + dummy data constants
│   │   ├── lib/
│   │   │   └── utils.js           # formatMessageTime helper
│   │   ├── App.jsx                # Route definitions with auth guards
│   │   └── main.jsx               # App root with BrowserRouter, AuthProvider, ChatProvider
│   ├── vercel.json                # SPA rewrite rules for Vercel
│   └── vite.config.js             # Vite + React + Tailwind plugin config
│
└── server/                        # Express backend
    ├── controllers/
    │   ├── userController.js      # signup, login, checkAuth, updateProfile
    │   └── messageController.js   # getUsersForSidebar, getMessages, sendMessage, markSeen
    ├── middleware/
    │   └── auth.js                # protectRoute — JWT verification middleware
    ├── models/
    │   ├── User.js                # Mongoose schema: email, fullName, password, profilePic, bio
    │   └── Message.js             # Mongoose schema: senderId, receiverId, text, image, seen
    ├── routes/
    │   ├── userRoutes.js          # /api/auth/* routes
    │   └── messageRoutes.js       # /api/messages/* routes
    ├── lib/
    │   ├── db.js                  # MongoDB Atlas connection via Mongoose
    │   ├── cloudinary.js          # Cloudinary SDK config
    │   └── utils.js               # generateToken (JWT)
    ├── server.js                  # Express app, Socket.IO server, userSocketMap, route mount
    └── vercel.json                # Vercel serverless deployment config
```

---

## Installation & Setup

### Prerequisites

- Node.js v18+
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster
- A [Cloudinary](https://cloudinary.com/) account (free tier works)

### 1. Clone the repository

```bash
git clone https://github.com/VimarshS/chat-app.git
cd chat-app
```

### 2. Set up the server

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:

```env
MONOGDB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net
PORT=5000
JWT_SECRET=your_strong_secret_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Set up the client

```bash
cd ../client
npm install
```

Create a `.env` file in the `client/` directory:

```env
VITE_BACKEND_URL=http://localhost:5000
```

### 4. Run locally

**Start the backend** (from `server/`):

```bash
npm run server   # uses nodemon for hot-reload
# or
npm start        # production start
```

**Start the frontend** (from `client/`):

```bash
npm run dev
```

The client runs on `http://localhost:5173` and proxies API calls to `http://localhost:5000`.

### 5. Build the client for production

```bash
cd client
npm run build
```

---

## Usage

### Sign Up

1. Navigate to `/login`.
2. Enter your full name, email address, and password, then click **Create Account**.
3. On the second step, write a short bio and submit.

### Chatting

1. After logging in, the sidebar lists all registered users with their online/offline status.
2. Use the **search bar** at the top to filter users by name.
3. Click any user to open the chat. Unread message counts are shown as badges next to each name.
4. Type a message and press **Enter** or click the send button to send text.
5. Click the **gallery icon** to attach and send an image (PNG/JPEG).

### Profile

1. Click the **hamburger menu** (top-right of sidebar) → **Edit Profile**.
2. Upload a new avatar, update your name or bio, and click **Save**.

### Right Panel

When a conversation is open, the right panel shows the selected user's profile picture, bio, and a scrollable grid of all images shared in that conversation. Clicking any image opens it in a new tab.

---

## Screenshots / Demo

> Screenshots can be added below. Replace the placeholder paths with actual image files placed in a `/screenshots` folder in the repository root.

| Login / Sign-up | Home — Chat View | Profile Editor |
|:---:|:---:|:---:|
| `screenshots/login.png` | `screenshots/home.png` | `screenshots/profile.png` |

---

## Architecture & Data Flow

```
┌─────────────────────────────────────────────────────────┐
│                        CLIENT                           │
│                                                         │
│  AuthContext ──── axios (JWT header) ──► REST API       │
│  ChatContext ──── axios              ──► REST API       │
│  AuthContext ──── socket.io-client   ──► Socket.IO      │
└──────────────────────────┬──────────────────────────────┘
                           │  HTTP + WebSocket
┌──────────────────────────▼──────────────────────────────┐
│                        SERVER                           │
│                                                         │
│  Express REST API                                       │
│  ├── POST /api/auth/signup   → bcrypt hash → MongoDB    │
│  ├── POST /api/auth/login    → bcrypt compare → JWT     │
│  ├── PUT  /api/auth/update-profile → Cloudinary upload  │
│  ├── GET  /api/messages/users → unseen counts           │
│  ├── GET  /api/messages/:id  → mark seen                │
│  ├── PUT  /api/messages/mark/:id → seen=true            │
│  └── POST /api/messages/send/:id → Cloudinary (images)  │
│                             └──► io.to(socketId).emit() │
│                                                         │
│  Socket.IO Server                                       │
│  ├── on "connection"  → store userId→socketId in map    │
│  ├── emit "getOnlineUsers" → broadcast to all clients   │
│  └── on "disconnect"  → remove from map, re-broadcast   │
└──────────────────────────┬──────────────────────────────┘
                           │
           ┌───────────────┼───────────────┐
           ▼               ▼               ▼
       MongoDB          Cloudinary       Vercel
      (messages,        (profile pics,   (hosting)
       users)            chat images)
```

**Message delivery flow:**
1. Sender calls `POST /api/messages/send/:receiverId` with `{ text }` or `{ image: base64 }`.
2. Server uploads any image to Cloudinary and saves the message document to MongoDB.
3. If the receiver has an active socket, the server calls `io.to(receiverSocketId).emit("newMessage", message)`.
4. The receiver's `ChatContext` listener appends the message to state (marking it seen if the conversation is already open, or incrementing the unread badge otherwise).

---

## Challenges & Highlights

- **Unified HTTP + WebSocket server** — The Express app and Socket.IO server share the same Node.js `http.Server` instance, keeping the deployment surface to a single Vercel serverless function.
- **userSocketMap pattern** — Rather than using Socket.IO rooms, the server maintains a plain in-memory object mapping `userId → socketId`. This allows direct targeted delivery (`io.to(socketId).emit(...)`) without the overhead of room management.
- **Base64 image pipeline** — Images are read client-side with `FileReader`, sent as base64 strings over the REST API (with a 4 MB body limit on Express), then streamed to Cloudinary. The resulting CDN URL is stored in MongoDB, keeping the database lean.
- **Context-driven real-time state** — All socket listeners live in `ChatContext` and re-register whenever `socket` or `selectedUser` changes (via `useEffect` cleanup), preventing stale closure issues.
- **Vercel serverless compatibility** — The server conditionally calls `server.listen()` only outside production (`NODE_ENV !== "production"`), then exports the server as default for Vercel's `@vercel/node` builder.

---

## Future Improvements

- **Group chats** — extend the Message model with a `groupId` reference and a Group model
- **Typing indicators** — emit a `typing` Socket.IO event while the input field is active
- **Message deletion / editing** — add soft-delete and edit history to the Message schema
- **Push notifications** — integrate Web Push or a service like Firebase Cloud Messaging for offline users
- **End-to-end encryption** — implement client-side key exchange before messages leave the browser
- **Pagination** — lazy-load message history instead of fetching the entire conversation at once
- **Refresh token rotation** — replace the non-expiring JWT with short-lived access tokens + refresh tokens
- **Rate limiting** — add `express-rate-limit` to auth and message endpoints

---

## Author

**Vimarsh Srivastava**

[![GitHub](https://img.shields.io/badge/GitHub-VimarshS-181717?logo=github&style=flat-square)](https://github.com/VimarshS)

---

<p align="center">Made with ☕ and Socket.IO</p>
