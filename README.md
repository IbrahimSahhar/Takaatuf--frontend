# Takaatuf Frontend

Frontend application for the Takaatuf platform built with React and Vite.

## 🚀 Tech Stack

- React
- Vite
- React Router DOM
- Context API
- React Bootstrap
- Bootstrap
- Axios

## ✨ Features

- Authentication (Login)
- Role-based access control
- Protected routes and guards
- Profile completion flow
- Clean and scalable project structure

## 📁 Project Structure

src/
├── app/
│ ├── routes/
│ │ ├── index.jsx # AppRoutes
│ │ ├── public.routes.jsx
│ │ ├── auth.routes.jsx
│ │ ├── dashboard.routes.jsx
│ │ └── system.routes.jsx
│ └── providers/
│ └── AppProviders.jsx # Providers wrapper
│
├── layouts/
│ ├── AppLayout.jsx  
│ ├── AuthLayout.jsx  
│ └── DashboardLayout.jsx  
│
├── features/
│ ├── auth/
│ │ ├── context/
│ │ │ └── AuthContext.jsx
│ │ ├── guards/
│ │ │ ├── RequireAuth.jsx
│ │ │ ├── RequireRole.jsx
│ │ │ ├── RedirectIfAuth.jsx
│ │ │ └── RequireProfileIncomplete.jsx
│ │ ├── pages/
│ │ │ └── LoginPage.jsx
│ │ ├── services/
│ │ │ └── authApi.js # طلبات auth
│ │ └── utils/
│ │ └── authStorage.js # localStorage helpers
│ │
│ └── profile/
│ └── pages/
│ └── CompleteProfilePage.jsx
│
├── pages/
│ ├── public/
│ │ ├── PublicRequestsPage.jsx
│ │ └── PublicRequestDetailsPage.jsx
│ ├── dashboards/
│ │ ├── RequesterDashboardPage.jsx
│ │ └── VolunteerDashboardPage.jsx
│ └── system/
│ └── NotFoundPage.jsx
│
├── components/
│ ├── navigation/
│ │ └── Topbar.jsx
│ └── ui/
│ └── RouteLoader.jsx
│
├── constants/
│ ├── routes.js # ROUTES
│ └── storageKeys.js  
│
├── services/
│ ├── http.js # axios instance
│ └── api.js # تجميع endpoints
│
├── hooks/
│ └── useSomething.js  
│
├── utils/
│ ├── guards.js  
│ └── path.js # fullPath helpers
│
├── styles/
│ └── globals.css
│
├── assets/
│
├── App.jsx
└── main.jsx

Authentication & Authorization:-

- Login flow implemented using Context API

- Role-based guards to control access to routes

- Unauthorized users are redirected appropriately

Notes:-

- Project follows modular and feature-based structure

- Routes and layouts are separated for better scalability

- Ready for future expansion and additional features
