# AI-Powered Multi-Restaurant Table Booking & Management Platform

A full-stack production-ready MERN (MongoDB, Express, React, Node.js) application featuring secure role-based access control (RBAC), interactive dashboards, Cloudinary-powered profile image uploads, an automated Gemini 2.5 Flash AI recommendation system, and strict mathematical double-booking overlap protection logic.

---

## 🚀 Key Features

### 🔐 Authentication & Role-Based Access Control (RBAC)

- **Multi-Role System:** Distinct dashboard experiences for **Customers**, **Restaurant Owners**, and **Admins** enforced via signed JSON Web Tokens (JWT) stored persistently in `localStorage`.
- **Secured Encryption:** Passwords salted and cryptographically hashed using `bcryptjs`.

### 🍱 Customer Suite

- **Interactive Restaurant Grid:** Browse all admin-approved partner restaurants with real-time availability and responsive styling powered by Tailwind CSS.
- **✨ Gemini AI Dining Assistant:** Integrated with Google Generative AI (`gemini-2.5-flash`). Customers provide custom preferences (cuisine, location, party constraints) and receive structured JSON array matches parsed directly from real-time database context.

### 🏪 Owner Portal

- **Restaurant Registration & CRUD:** Owners can register, update, and manage their restaurant profiles.
- **Automated Media Pipeline:** Streamlined multipart form file handler through Multer and secure automated staging to Cloudinary buckets for immediate cover photo updates.
- **Seating Configurator:** Owners dynamically create and manage table slots mapped out with fixed guest capacities.
- **Live Reservation Ledger:** Actionable dashboard to review, approve, or reject pending customer booking requests in real-time.

### 🛡️ Admin Verification Workflow

- **Approval Pipeline:** Centralized dashboard for platform admins to review all new restaurant submissions.
- **Verification Actions:** Approve or reject restaurant registrations before they appear on the customer-facing marketplace.

### 🛡️ Double-Booking Prevention Engine

- Implements robust backend async evaluations to enforce slot isolation. Overlapping slots are mathematically bounded using interval boundary logic:
  $$\text{(RequestedStartTime} < \text{ExistingEndTime)} \land \text{(RequestedEndTime} > \text{ExistingStartTime)}$$
- Attempts to book overlapping slots trigger explicit `409 Conflict` response states to guarantee non-overlapping bookings.

---

## 🛠️ Tech Stack

- **Frontend:** React (Vite), Tailwind CSS v4, React Router DOM
- **Backend:** Node.js, Express.js framework, Mongoose ODM
- **Cloud Database:** MongoDB Atlas
- **Media Cloud:** Cloudinary CDN Storage
- **AI Engine:** Google Gemini Generative AI SDK (`@google/generative-ai`)

---

## 📂 Project Architecture

```text
multi-restaurant-management/
├── client/                 # React Frontend Client (Vite Environment)
│   ├── src/
│   │   ├── components/     # Customer, Owner, and Admin Dashboards, Auth screens
│   │   ├── App.jsx         # App router wrapper & Global Context state
│   │   ├── index.css       # Tailwind entry styles
│   │   └── main.jsx        # Root render script
│   ├── public/
│   │   └── vercel.json     # Single Page Application routing rewrite rule
│   └── package.json
├── server/                 # Node.js / Express Backend Server
│   ├── config/             # Cloud Database & Cloudinary connectors
│   ├── controllers/        # Auth, Restaurant, Booking, Admin, and AI logic
│   ├── middleware/         # Token validation and RBAC role shields
│   ├── models/             # Mongoose Entity Schemas (User, Restaurant, Table, Booking)
│   ├── routes/             # Isolated Express endpoint routes
│   ├── .env                # Environment keys (Ignored by Git)
│   ├── package.json
│   └── server.js           # Main server application entry point
├── .gitignore
└── README.md
```
