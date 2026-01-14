# SafeRoadsAI - AI-Powered Pothole Detection & Reporting Platform

**SafeRoadsAI** is an intelligent pothole detection and reporting platform that leverages AI to identify potholes from user-submitted images or camera feeds. It enables real-time pothole detection with geolocation tagging and seamless reporting to help municipal authorities maintain safer roads. The system empowers both users and administrators through a responsive interface and scalable backend.

## Features

- **AI-Based Detection**: Uses computer vision models to detect potholes in real-time.
- **Geo-tagged Reporting**: Automatically captures user location and submits pothole data to a centralized dashboard.
- **User-Friendly Interface**: Citizens can easily upload images and report road issues.
- **Scalable & Secure**: Built with modern tools to ensure fast and safe operations.

## Tech Stack

- **Frontend**: React Native (Expo)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Machine Learning**: Python (OpenCV)

## Installation

### Prerequisites

Before you begin, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v20 or higher)
- [MongoDB](https://www.mongodb.com/) or a MongoDB Atlas account
- [Python 3.8+](https://www.python.org/downloads/) for the AI model
- [Git](https://git-scm.com/)

### Steps to Run Locally

1. Clone the repository
```
git clone https://github.com/rishvant/Pothole-App
cd Pothole-App
```

2. Install Frontend Dependencies
```
cd client
npm install
```

3. Install Backend Dependencies
```
cd ../server
npm install
```

4. Set Up Environment Variables

5. Run Backend Server
```
cd ../server
node server.js
```

6. Run Frontend Server
```
cd ../client
npx expo start
```
