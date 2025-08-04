Mini LinkedIn Clone

A full-stack LinkedIn-like social platform built with MERN Stack (MongoDB, Express.js, React.js, Node.js) featuring Cloudinary for image uploads and JWT authentication.
Users can register, log in, manage profiles, create posts with images, and view a global feed.

Features
User Authentication – Signup & Login with hashed passwords (bcrypt) + JWT tokens

Profile Management – Bio & Avatar upload via Cloudinary

Post System – Create, view, and manage posts with images

Feed Display – Show posts from all users

MongoDB Atlas – Cloud database integration

Responsive UI – React + CSS

API-first architecture – REST APIs for easy frontend integration

Tech Stack
Frontend: React.js (Vite), React Router DOM, Axios
Backend: Node.js, Express.js, MongoDB (Mongoose)
Authentication: JWT, bcrypt
Image Hosting: Cloudinary
Deployment: Frontend (Netlify/Vercel), Backend (Render), DB (MongoDB Atlas)

Setup Instructions
1. Clone Repository

git clone https://github.com/anupampal01/mini-linkedin.git

cd mini-linkedin
2. Backend Setup

cd backend
npm install

Run backend:

npm run start
Backend runs on: http://localhost:5000

3. Frontend Setup

cd ../frontend
npm install
npm start
Frontend runs on: http://localhost:5173

Live Deployment 🌐
Frontend (Netlify)
Correct Live: https://charming-brioche-9c28c8.netlify.app

Backend (Render)
Current Active: https://mini-linkedin-inpq.onrender.com

Developer 👨‍💻
Anupam Pal

Portfolio | GitHub | LinkedIn