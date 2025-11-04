# UCC Clinic Management System

A comprehensive web application for managing clinic operations, student records, and medical requests for University of Cebu Clinic (UCC). This system provides an intuitive interface for both students and administrators to handle clinic-related services efficiently.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-ISC-green)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Features Overview](#features-overview)
- [User Guide](#user-guide)
- [Development](#development)
- [Security](#security)
- [Contributing](#contributing)

## ✨ Features

### Public Features
- **Landing Page**: Beautiful, responsive landing page with clinic information
- **Request Form Submission**: Easy-to-use form for students to submit medical requests
- **About Us**: Organizational chart and clinic information
- **Search Functionality**: Search feature (ready for implementation)

### Admin Features
- **Authentication System**: Secure login with Firebase
- **Dashboard**: Comprehensive admin dashboard with statistics
- **Request Management**: View, approve, and reject student requests
- **Monthly Reports**: Visual charts showing illness statistics
- **Patient Registration**: Quick access to register new patients
- **Responsive Design**: Fully responsive across all devices (mobile, tablet, desktop)

### System Features
- **Firebase Integration**: Real-time database with Firestore
- **Secure Authentication**: Password hashing with bcrypt
- **Status Management**: Track request status (Pending, Approved, Rejected, Processing)
- **Real-time Updates**: Instant UI updates after status changes
- **Environment Configuration**: Secure credential management

## 🛠 Tech Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Recharts** - Chart library for data visualization
- **Context API** - State management

### Backend
- **Node.js** - Runtime environment
- **Express 5** - Web framework
- **TypeScript** - Type safety
- **Firebase Admin SDK** - Server-side Firebase operations
- **Firestore** - NoSQL database
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Database
- **Firebase Firestore** - Cloud NoSQL database

## 🏗 System Architecture

```
┌─────────────────┐
│   React Client   │
│   (Port 5173)   │
└────────┬────────┘
         │
         │ HTTP/REST
         │
┌────────▼────────┐
│  Express API    │
│  (Port 3000)    │
└────────┬────────┘
         │
         │ Admin SDK
         │
┌────────▼────────┐
│   Firestore     │
│   (Firebase)    │
└─────────────────┘
```

## 🚀 Getting Started

### Prerequisites
- Node.js v18 or higher
- npm or yarn
- Firebase project with Firestore enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd clinic
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   ```
   
   See [SETUP.md](./SETUP.md) for detailed setup instructions including Firebase configuration.

3. **Frontend Setup**
   ```bash
   cd client
   npm install
   ```

4. **Configure Environment Variables**
   - Backend: Create `server/.env` (see SETUP.md)
   - Frontend: Create `client/.env` with `VITE_API_URL=http://localhost:3000`

5. **Initialize Admin User**
   ```bash
   cd server
   npm run init-admin
   ```

6. **Start Development Servers**
   ```bash
   # Terminal 1 - Backend
   cd server
   npm run dev

   # Terminal 2 - Frontend
   cd client
   npm run dev
   ```

7. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

## 📁 Project Structure

```
clinic/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   │   ├── admin/     # Admin-specific components
│   │   │   │   ├── AdminSidebar.tsx
│   │   │   │   ├── AdminTopBar.tsx
│   │   │   │   ├── WelcomeCard.tsx
│   │   │   │   ├── RegisterPatientCard.tsx
│   │   │   │   └── MonthlyReportCard.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── LoginModal.tsx
│   │   │   ├── RequestFormModal.tsx
│   │   │   └── Modal.tsx
│   │   ├── pages/         # Page components
│   │   │   ├── LandingPage.tsx
│   │   │   └── admin/
│   │   │       ├── Home.tsx
│   │   │       └── RequestedForms.tsx
│   │   ├── context/       # React Context providers
│   │   │   └── AuthContext.tsx
│   │   ├── config/        # Configuration files
│   │   │   └── env.ts
│   │   ├── routes/        # Route definitions
│   │   │   └── AppRoutes.tsx
│   │   └── types/         # TypeScript type definitions
│   └── .env               # Environment variables (not committed)
│
└── server/                # Backend Express API
    ├── src/
    │   ├── controllers/   # Request handlers
    │   │   ├── authController.ts
    │   │   └── requestController.ts
    │   ├── routes/         # API routes
    │   │   ├── authRoutes.ts
    │   │   └── requestRoutes.ts
    │   ├── config/         # Configuration
    │   │   ├── db.ts       # Firebase connection
    │   │   ├── env.ts      # Environment config
    │   │   └── serviceAccountKey.json  # Firebase credentials (not committed)
    │   ├── scripts/        # Utility scripts
    │   │   └── initAdmin.ts
    │   └── server.ts       # Express app entry point
    └── .env                # Environment variables (not committed)
```

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "user-id",
    "username": "admin",
    "role": "admin"
  }
}
```

### Request Endpoints

#### Create Request
```http
POST /api/requests
Content-Type: application/json

{
  "fullname": "John Doe",
  "yearSection": "3rd Year - Section A",
  "schoolIdNumber": "2024-00123",
  "departmentCourse": "Computer Science",
  "assessment": "Medical Checkup",
  "referredTo": "Dr. Smith"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Request form submitted successfully",
  "requestId": "request-id",
  "data": { ... }
}
```

#### Get All Requests
```http
GET /api/requests
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "request-id",
      "fullname": "John Doe",
      "yearSection": "3rd Year - Section A",
      "schoolIdNumber": "2024-00123",
      "departmentCourse": "Computer Science",
      "assessment": "Medical Checkup",
      "referredTo": "Dr. Smith",
      "status": "pending",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### Update Request Status
```http
PATCH /api/requests/:id/status
Content-Type: application/json

{
  "status": "approved"  // or "rejected", "pending", "processing"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Request approved successfully",
  "data": { ... }
}
```

### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

## 🎯 Features Overview

### 1. Landing Page
- **Hero Section**: Welcome message with clinic branding
- **Navigation**: Header with links to About Us, Blog, Request Form, and Login
- **Search Bar**: Search functionality (UI ready)
- **Responsive Design**: Optimized for all screen sizes

### 2. Request Form Modal
Students can submit medical request forms with the following fields:
- Full Name
- Year & Section
- School ID Number
- Department/Course
- Assessment (type of medical assessment needed)
- Referred To (referral information)

**Features:**
- Modal popup interface
- Form validation
- Success/error messages
- Auto-close on success
- Background blur effect

### 3. Admin Dashboard

#### Dashboard Overview
- **Welcome Card**: Personalized greeting with user information
- **Register Patient Card**: Quick access to patient registration
- **Monthly Report Card**: Interactive pie chart showing:
  - Big three diseases
  - NTDs (Neglected Tropical Diseases)
  - Infectious diseases
  - Others

#### Navigation Sidebar
- Dashboard
- Clinic Inventory (planned)
- Registration (planned)
- Students Record (planned)
- **Requested Form** - View and manage all requests
- Staff Schedule (planned)
- Monthly Report (planned)

### 4. Request Management
- **View All Requests**: Table and card views (responsive)
- **Status Tracking**: Color-coded status badges
  - 🟡 Pending
  - 🟢 Approved
  - 🔴 Rejected
  - 🔵 Processing
- **Approve/Reject Actions**: One-click approval/rejection
- **Reset Status**: Change status back to pending if needed
- **Real-time Updates**: Instant UI refresh after status changes
- **Sorting**: Requests sorted by creation date (newest first)

### 5. Authentication System
- **Secure Login**: Username/password authentication
- **Session Management**: LocalStorage-based session
- **Protected Routes**: Admin routes require authentication
- **Auto-redirect**: Redirects to home if not authenticated
- **Logout Functionality**: Secure logout with session cleanup

## 👥 User Guide

### For Students

1. **Submit a Request Form**
   - Navigate to the landing page
   - Click "Request Form" in the header
   - Fill out all required fields
   - Click "Submit"
   - Wait for confirmation message

2. **View About Us**
   - Click "About Us" in the header
   - View organizational chart and clinic information

### For Administrators

1. **Login**
   - Click "login" in the header
   - Enter credentials:
     - Username: `admin`
     - Password: `admin`
   - Redirects to admin dashboard

2. **View Requests**
   - Navigate to "Requested Form" in sidebar
   - View all submitted requests in table/card format
   - Filter by status (planned feature)

3. **Approve/Reject Requests**
   - Click "Approve" (green button) or "Reject" (red button)
   - Status updates immediately
   - Use "Reset" to change status back to pending

4. **View Dashboard**
   - Access dashboard statistics
   - View monthly reports with charts
   - Quick access to common actions

## 🔧 Development

### Available Scripts

#### Backend
```bash
npm run dev          # Start development server with nodemon
npm run init-admin   # Initialize admin user in Firestore
```

#### Frontend
```bash
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Code Style
- TypeScript for type safety
- ESLint for code linting
- Consistent component structure
- Responsive-first design approach

### Adding New Features

1. **New Route**: Add to `client/src/routes/AppRoutes.tsx`
2. **New API Endpoint**: 
   - Create controller in `server/src/controllers/`
   - Add route in `server/src/routes/`
   - Register in `server/src/server.ts`
3. **New Component**: Add to `client/src/components/`
4. **New Page**: Add to `client/src/pages/`

## 🔒 Security

- ✅ Credentials in `.gitignore`
- ✅ Environment variables for configuration
- ✅ Password hashing with bcrypt
- ✅ Firebase Admin SDK for secure database access
- ✅ CORS protection
- ✅ Input validation on API endpoints

See [README_SECURITY.md](./README_SECURITY.md) for detailed security information.

## 📊 Database Schema

### Users Collection
```typescript
{
  id: string
  username: string
  password: string (hashed)
  role: string
  createdAt: Date
  updatedAt: Date
}
```

### Requests Collection
```typescript
{
  id: string
  fullname: string
  yearSection: string
  schoolIdNumber: string
  departmentCourse: string
  assessment: string
  referredTo: string
  status: "pending" | "approved" | "rejected" | "processing"
  createdAt: Date
  updatedAt: Date
}
```

## 🚧 Planned Features

- [ ] Clinic Inventory Management
- [ ] Patient Registration System
- [ ] Students Record Management
- [ ] Staff Schedule Management
- [ ] Advanced Monthly Reports
- [ ] Email Notifications
- [ ] Search and Filter Functionality
- [ ] Export Reports to PDF/Excel
- [ ] Multi-user Role Management
- [ ] Audit Logs

## 🐛 Troubleshooting

### Common Issues

1. **Firebase Connection Error**
   - Verify `serviceAccountKey.json` is in correct location
   - Check Firebase project settings
   - Ensure Firestore is enabled

2. **API Connection Failed**
   - Verify backend server is running
   - Check `VITE_API_URL` in frontend `.env`
   - Ensure CORS is properly configured

3. **Login Not Working**
   - Run `npm run init-admin` to create admin user
   - Verify user exists in Firestore
   - Check password hashing

## 📝 License

ISC License

## 👨‍💻 Contributors

- Development Team

## 📞 Support

For issues and questions, please create an issue in the repository.

---

**Note**: This is a development version. For production deployment, ensure all security measures are properly configured.

