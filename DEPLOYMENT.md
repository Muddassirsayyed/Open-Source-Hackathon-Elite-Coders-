# Deployment Guide - FixMate AI

This document provides guidelines for local deployment and setting up database clusters.

---

## 1. Local Prerequisites
Ensure you have the following software installed:
*   [Node.js](https://nodejs.org/) v18 or later
*   [npm](https://www.npmjs.com/) v9 or later
*   [MongoDB Community Server](https://www.mongodb.com/try/download/community) (if deploying database locally)

---

## 2. Server Setup (Backend API)
1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Configure environmental variables `.env`:
   ```properties
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/fixmate_ai
   JWT_SECRET=your_super_secret_signing_key
   ```
4. Seed mock professionals and services into the database:
   ```bash
   npm run seed
   ```
5. Launch the Node API server in development mode:
   ```bash
   npm run dev
   ```
   *   The server will start listening on [http://localhost:5000](http://localhost:5000).

---

## 3. Client Setup (Next.js Frontend)
1. Navigate to the client folder:
   ```bash
   cd client
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Set up the production build:
   ```bash
   npm run build
   ```
4. Start the client server:
   ```bash
   npm run dev
   ```
   *   The web app will start on [http://localhost:3000](http://localhost:3000).

---

## 4. Production Deployment (PaaS/VPS)

### MongoDB Atlas Setup
1. Create a free shared cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Go to Database Access -> Add New Database User (with readWrite permissions).
3. Go to Network Access -> Add IP Address -> Allow Access from Anywhere (`0.0.0.0/0`).
4. Copy your Connection String and replace `MONGODB_URI` inside your server environment variables.

### Deploying Backend (e.g. Render, Heroku)
*   Root Directory: `server`
*   Build Command: `npm install`
*   Start Command: `npm start`
*   Set Environment Variables on PaaS: `MONGODB_URI`, `JWT_SECRET`, `PORT`.

### Deploying Frontend (e.g. Vercel, Netlify)
*   Build Command: `npm run build`
*   Output Directory: `client/.next`
*   Set Environment Variables on PaaS: `NEXT_PUBLIC_API_URL` (points to deployed backend URL) and `NEXT_PUBLIC_SOCKET_URL` (points to deployed backend URL).
