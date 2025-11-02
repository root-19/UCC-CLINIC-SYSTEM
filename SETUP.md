# Clinic Management System - Setup Guide

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase project with Firestore enabled

## Backend Setup

1. **Navigate to server directory**:
   ```bash
   cd server
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Setup Firebase Credentials**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project: `phonic-presence-417323`
   - Navigate to: Project Settings > Service Accounts
   - Click "Generate New Private Key"
   - Save the downloaded JSON file as:
     ```
     server/src/config/serviceAccountKey.json
     ```
   - **IMPORTANT**: This file is already in `.gitignore` - never commit it!

4. **Create environment file** (optional):
   ```bash
   # Create .env file in server/ directory
   PORT=3000
   NODE_ENV=development
   ```

5. **Initialize admin user**:
   ```bash
   npm run init-admin
   ```
   This creates an admin user with:
   - Username: `admin`
   - Password: `admin`

6. **Start the server**:
   ```bash
   npm run dev
   ```
   Server will run on `http://localhost:3000`

## Frontend Setup

1. **Navigate to client directory**:
   ```bash
   cd client
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create environment file** (optional):
   ```bash
   # Create .env file in client/ directory
   VITE_API_URL=http://localhost:3000
   VITE_NODE_ENV=development
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```
   Client will run on `http://localhost:5173` (or another port)

## Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment mode (development/production)

### Frontend (.env)
- `VITE_API_URL` - Backend API URL (default: http://localhost:3000)
- `VITE_NODE_ENV` - Environment mode

**Note**: All `.env` files are in `.gitignore` and should never be committed.

## Security Notes

- ✅ `serviceAccountKey.json` is in `.gitignore`
- ✅ `.env` files are in `.gitignore`
- ✅ API URLs use environment variables
- ✅ No hardcoded credentials in code

See `README_SECURITY.md` for more security information.

## Default Login Credentials

- **Username**: `admin`
- **Password**: `admin`

**Change these immediately in production!**

