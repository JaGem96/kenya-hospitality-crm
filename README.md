# 🏨 Kenya Hospitality CRM

A full-stack, production-ready Property Management System built with the MERN stack (MongoDB, Express, React, Node.js). Designed to help hospitality businesses in Kenya manage properties, track bookings, and analyze revenue in real-time.

## 🌍 Live Demo
- **Frontend:** (https://kenya-hospitality-crm.vercel.app/)
- **Backend API:** (https://kenya-hospitality-crm-api.onrender.com)



## ✨ Key Features

### 📊 Real-Time Analytics Dashboard
- Interactive charts visualizing weekly revenue, occupancy rates, and property distribution.
- Live tracking of total capacity and active bookings.

### 🔒 Secure Authentication
- JWT-based authentication with Bcrypt password hashing.
- Protected routes ensuring only authorized users can access business data.
- Role-based access (Admin, BnB Host, Hotel Owner).

### 🏨 Property Management
- Add, view, and manage multiple properties (Hotels, BnBs, Hostels).
- Image uploads and detailed location tracking (County, Town).
- Dynamic pricing and guest capacity settings.

### 📅 Automated Booking Engine
- Date-based availability tracking.
- Automatic price calculations based on check-in/check-out dates.
- Status tracking (Pending, Confirmed, Checked In, Checked Out).

### 👥 Smart Guest CRM
- Automatically generates a guest directory from booking data.
- Tracks lifetime value (LTV) and total stays per guest.
- Identifies and highlights VIP guests.

## 🛠️ Tech Stack

**Frontend:**
- React.js (Vite)
- Tailwind CSS (Styling)
- Recharts (Data Visualization)
- Axios (HTTP Requests)
- React Hot Toast (Notifications)
- Lucide React (Icons)

**Backend:**
- Node.js & Express
- MongoDB & Mongoose (Database)
- JWT & Bcrypt (Security)

**Deployment:**
- Vercel (Frontend)
- Render (Backend)
- MongoDB Atlas (Cloud Database)

## 🚀 Getting Started (Local Setup)

Follow these steps to run the project locally on your machine.

### Prerequisites
- Node.js installed
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repository
```bash
git clone https://github.com/JaGem96/kenya-hospitality-crm.git
cd kenya-hospitality-crm