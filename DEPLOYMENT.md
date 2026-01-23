# Deployment Guide: Render + Netlify

## Overview
- **Backend**: Deploy on Render (Free tier available)
- **Frontend**: Deploy on Netlify (Free tier available)

---

## Step 1: Deploy Backend to Render

### 1.1 Prepare Your Code
Push your backend code to GitHub (or GitLab).

### 1.2 Create Render Web Service
1. Go to [render.com](https://render.com) and sign up/login
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select the **backend** folder

### 1.3 Configure Build Settings
| Setting | Value |
|---------|-------|
| **Name** | `taskflow-api` (or your choice) |
| **Root Directory** | `backend` |
| **Environment** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |

### 1.4 Add Environment Variables
In Render dashboard, go to **Environment** tab and add:

| Key | Value |
|-----|-------|
| `PORT` | `10000` |
| `MONGO_URI` | Your MongoDB connection string |
| `JWT_SECRET` | Your secret key (e.g., `your-super-secret-jwt-key-123`) |

### 1.5 Deploy
Click **"Create Web Service"**. Render will build and deploy your backend.

Your backend URL will be: `https://taskflow-api.onrender.com`

---

## Step 2: Deploy Frontend to Netlify

### 2.1 Prepare Your Code
Push your frontend code to GitHub.

### 2.2 Create Netlify Site
1. Go to [netlify.com](https://netlify.com) and sign up/login
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect your GitHub repository
4. Select the **frontend** folder

### 2.3 Configure Build Settings
| Setting | Value |
|---------|-------|
| **Base directory** | `frontend` |
| **Build command** | `npm run build` |
| **Publish directory** | `frontend/dist` |

### 2.4 Add Environment Variables
In Netlify dashboard, go to **Site settings** → **Environment variables** and add:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://taskflow-api.onrender.com` (your Render URL) |

### 2.5 Deploy
Click **"Deploy site"**. Netlify will build and deploy your frontend.

---

## Step 3: Update CORS (Important!)

After deployment, update your backend's CORS configuration if needed.

In `backend/server.js`, you can optionally restrict CORS:
```javascript
app.use(cors({
  origin: ['https://your-app.netlify.app', 'http://localhost:5173'],
  credentials: true
}));
```

---

## Step 4: Test Your Deployment

1. Visit your Netlify URL (e.g., `https://your-app.netlify.app`)
2. Try to register a new owner account
3. Login and test all features

---

## Troubleshooting

### Backend not responding?
- Check Render logs for errors
- Verify environment variables are set correctly
- Ensure MongoDB URI is accessible from Render's servers

### Frontend showing blank page?
- Check browser console for errors
- Verify `VITE_API_URL` is set correctly
- Redeploy after changing environment variables

### CORS errors?
- Make sure your Netlify URL is allowed in backend CORS
- Check that the API URL doesn't have a trailing slash

---

## Environment Variables Summary

### Backend (Render)
```
PORT=10000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanager
JWT_SECRET=your-super-secret-jwt-key-123
```

### Frontend (Netlify)
```
VITE_API_URL=https://your-backend.onrender.com
```
