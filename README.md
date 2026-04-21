## Best Version — Mongo + premium auth + admin panel

This package is set up for a local MongoDB workflow on Windows and now includes:

- homepage section visuals loaded from local SVG assets
- cookie-based auth with email, phone OTP, and Google hooks
- admin panel for recent users and auth activity
- auth event tracking for signup and login method visibility
- local image-first setup to avoid third-party image lag and cookie issues

## What changed in this version

- added local section images for the homepage blocks
- added Mongo-backed admin panel at `/admin`
- added auth event logging for signup/login/logout
- added admin user bootstrap on backend start
- added recent user + auth event monitoring APIs
- kept image assets local and lightweight for smooth scrolling
- switched mentor seed avatars to local SVG files instead of remote image URLs

## Folder structure

- `backend/` → Express + MongoDB API
- `src/` → React + Vite frontend
- `public/section-media/` → local SVG illustrations used by the homepage and mentor seed data

## 1) Install once on Windows

Double click:

- `INSTALL_WINDOWS.bat`

Or run manually:

```powershell
npm install
cd backend
npm install
cd ..
```

## 2) Start MongoDB

```powershell
Start-Service MongoDB
```

If you use Atlas instead of local MongoDB, update `backend/.env` first.

## 3) Optional: reseed local mentors / gigs / challenges

If you want the latest local mentor avatars and sample data:

```powershell
npm run seed
```

## 4) Run the app

Fastest option:

- double click `RUN_WINDOWS.bat`

Manual option:

Terminal 1:

```powershell
npm run server
```

Terminal 2:

```powershell
npm run dev
```

## URLs

- Frontend: `http://localhost:8081`
- Backend health check: `http://localhost:5000/api/health`
- Admin panel: `http://localhost:8081/admin`

## Default local admin login

Use this account for the admin panel:

- Email: `admin@bestversion.com`
- Password: `Admin@123`

You can change these in `backend/.env`:

```env
ADMIN_NAME=Best Version Admin
ADMIN_EMAIL=admin@bestversion.com
ADMIN_PASSWORD=Admin@123
```

## Common checks

If signup/login fails:

1. open `http://localhost:5000/api/health`
2. confirm backend terminal shows `Server running on http://localhost:5000`
3. confirm MongoDB is running
4. try the auth flow again

If the admin panel shows no users/events yet:

1. sign up or log in with email / phone / Google
2. refresh `/admin`
3. confirm the backend is connected to the same Mongo database you are using in Compass/Atlas

## Env files already included

Root `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Backend `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017
MONGO_DB_NAME=best_version 
MONGO_URI=mongodb+srv://<DB_USERNAME>:<DB_PASSWORD>@<CLUSTER_HOST>/best_version?retryWrites=true&w=majority&appName=Cluster0
MONGO_DB_NAME=best_version
JWT_SECRET=best_version_super_secret_key_123
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:8081
CLIENT_URL=http://localhost:8081
ADMIN_NAME=Best Version Admin
ADMIN_EMAIL=admin@bestversion.com
ADMIN_PASSWORD=Admin@123
```
