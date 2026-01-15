# 🚧 SafeRoadsAI – AI‑Based Pothole Detection & Reporting System

SafeRoadsAI is a full‑stack mobile and web‑based application that uses **Artificial Intelligence (YOLO)** to **detect potholes in real time** and allows users to **report road damage with location and images**.  
The goal is to help authorities and communities improve road safety through technology.

---

## 📌 Features

### 👤 Authentication
- User Signup & Login (JWT‑based authentication)
- Secure token storage on the client

### 📷 Pothole Reporting
- Capture or upload pothole images
- Automatic GPS location detection
- Store reports with description, image, and coordinates
- View all reports and report history

### 🤖 AI‑Based Pothole Detection
- YOLOv8‑based trained pothole detection model
- Real‑time detection using camera frames
- Adjustable confidence threshold
- Detection results returned from Python backend

### 🗺️ Location Support
- Uses device GPS for latitude & longitude
- Map view support (optional)

---

## 🧱 Tech Stack

### Frontend (Client)
- **React Native (Expo)**
- **TypeScript**
- Expo Camera & Location
- Axios
- Expo Router

### Backend (Server)
- **Node.js**
- **Express.js**
- **MongoDB (Mongoose)**
- JWT Authentication
- Multer (Image Uploads)

### AI / ML Service
- **Python**
- **YOLOv8 (Ultralytics)**
- **FastAPI**
- OpenCV
- NumPy

---


---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/SafeRoadsAI.git
cd SafeRoadsAI
