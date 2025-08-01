# NestInn Concierge Platform

NestInn is a digital concierge solution for hotels that empowers guests to request services in real time and enables staff to efficiently manage and fulfill those requests. Built with **React.js**, **CSS**, and **Supabase** for the backend, NestInn streamlines hotel operations and enhances the guest experience.

---

## Demo Screenshots

![Login Page](./screenshots/login.png)
![User Dashboard](./screenshots/user-dashboard.png)
![User Dashboard](./screenshots/user-dashboard1.png)
![Staff Dashboard](./screenshots/staff-dashboard.png)
![Staff Dashboard](./screenshots/staff-dashboard1.png)
![Service Request Flow](./screenshots/service-request.png)

---

## About the Project

This project provides hotel guests with a simple way to request services (like cleaning or laundry), while enabling staff to efficiently manage and complete those requests. It’s built using **React.js**, **CSS**, and **Supabase** for the backend.

---

## Table of Contents

- [Core Features](#core-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
  - [Running the Frontend](#running-the-frontend)
  - [Connecting with Supabase](#connecting-with-supabase)
- [Pages Overview](#pages-overview)
- [Future Enhancements](#future-enhancements)

---

## Core Features

### Guest Features
- Sign up / Log in securely
- Submit requests for services:
  - Room Cleaning
  - Laundry
  - In-Room Dining
  - Wake-Up Calls
  - Maintenance
  - Cab Booking
- Track service status (Pending → In Progress → Completed)
- View and manage profile info

### Staff Features
- Sign up / Log in (with email confirmation)
- View assigned guest requests
- Update request status
- View all service history and actions

> Each user type sees a different dashboard optimized for their role.

---

## Tech Stack

- **Frontend:** React.js, CSS  
- **Backend:** Supabase (Authentication & Realtime Database)
- **State Management:** React Context API
- **Routing:** React Router

---

## Project Structure

```
HeyConcierge/
├── public/
│   └── vite.svg
├── src/
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── admin/                # (Optional placeholder)
│   │   ├── auth/
│   │   │   ├── LoginPage.jsx
│   │   │   └── LoginPage.css
│   │   ├── guest/
│   │   │   ├── UserDashboard.jsx
│   │   │   └── UserProfilePage.jsx
│   │   └── staff/
│   │       └── StaffDashboard.jsx
│   ├── services/
│   │   └── supabaseClient.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js & npm
- Git
- Supabase account

### Installation

```bash
git clone https://github.com/yourusername/NestInn.git
cd NestInn
npm install
```

---

## Usage

### Running the Frontend

```bash
npm start
```
The app runs locally at [http://localhost:3000](http://localhost:3000)

### Connecting with Supabase

1. Go to [Supabase](https://app.supabase.com)
2. Create a new project and copy your project URL and API key
3. Add your Supabase credentials to a `.env` file in your project root:

```env
REACT_APP_SUPABASE_URL=your_url_here
REACT_APP_SUPABASE_KEY=your_key_here
```

---

## Pages Overview

### Login / Signup
- Guests and staff can register/login with email & password.
- Email confirmation is required (handled by Supabase).

### Guest Dashboard
- Request hotel services from a dropdown menu.
- Track the status of all service requests.
- View a history of previous requests with timestamps.

### Staff Dashboard
- View all active service requests.
- Claim/assign a request.
- Update request status to completed.

### User Profile
- View and edit user details.
- See a personal service summary (not full list).
- Option to update name and contact information.

---

## Future Enhancements

- Admin analytics dashboard
- Notifications when staff accepts a request
- Chat between user and staff
- Estimated wait times per service
- Mobile responsive improvements

