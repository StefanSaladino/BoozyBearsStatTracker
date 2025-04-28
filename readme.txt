# Hockey Stats Management System

## Overview

This project is a full-stack application designed to track and manage statistics for a men's league hockey team. It features an API built with Node.js and Express, a MongoDB database for data storage, and a React frontend for user interaction. The application supports player management (including skater and goalie types), video highlight uploads, and an admin dashboard to manage players, stats, and videos.

## Features

- **Admin Dashboard**: Allows the admin to manage players, view player stats, edit player details, and manage highlight videos.
- **Player Management**: Supports CRUD operations for players, including skaters and goalies with specific statistics.
- **Highlight Video Management**: Upload, edit, and delete highlight videos, associated with players.
- **Authentication & Authorization**: Session-based authentication, ensuring the admin has exclusive access to certain routes and features.
- **Responsive Frontend**: Built using React, with form validation and inline error handling.
- **Rate Limiting & Security**: Includes rate limiting, brute-force protection, and secure file handling.

## Tech Stack

- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Frontend**: React, TypeScript, Bootstrap
- **Authentication**: JWT, Sessions
- **Database**: MongoDB (with GridFS for video storage)
- **Testing**: Mocha, Chai, Supertest, Vitest, React Testing Library

## Installation

### Prerequisites

Ensure that the following software is installed on your local machine:

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/) (local or a cloud database)

### Step-by-Step Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/hockey-stats-management.git
   cd hockey-stats-management

Install backend dependencies:
From the backend directory:
npm install

Install frontend dependencies:
From the frontend directory:
npm install


Environment Configuration:

Create a .env file in the backend directory and define the following variables:
CONNECTION_STRING_MONGODB=
PORT=
SESSION_SECRET=your-session-secret

Start the application:
In the root directory, run the backend and frontend in separate terminal windows.

Start the backend:
cd project-api
nodemon


Start the frontend:
cd project-frontend
npm run dev

Testing:

To run tests for the backend:
cd project-api
npm test

To run tests for the frontend:
cd project-frontend
npm run test

Usage
Admin Dashboard: Access the admin dashboard by logging in with admin credentials.

Player Management: Add, update, or delete players through the admin dashboard.

Highlight Management: Upload video highlights, edit their metadata (game date, description), and delete videos.

Player Stats: View player statistics (for both skaters and goalies).

API Endpoints
/api/videos
GET /api/videos: Fetch all highlight videos.
GET /api/videos/:filename: Stream a specific highlight video.
PUT /api/videos/:filename: Edit metadata for a specific highlight video.
DELETE /api/videos/:filename: Delete a specific highlight video.

/api/players
GET /api/players: Fetch all players and their stats.
POST /api/players: Add a new player.
PUT /api/players/:id: Update a player's stats.
DELETE /api/players/:id: Delete a player.

Authentication Routes
POST /login: Log in as an admin (hardcoded credentials).
POST /logout: Log out and end the session.

Testing

Backend Testing: Backend tests are written using Mocha, Chai, and Supertest.
Frontend Testing: Frontend tests are written using Vitest and React Testing Library.
