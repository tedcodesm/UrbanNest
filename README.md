# UrbanNest 🏠

UrbanNest is a premium real-estate application built with React Native (Expo) and a Node.js/MongoDB backend. It provides a seamless platform for landlords to list properties and for tenants to find, book viewings, and pay for their next home.

## ✨ Features

- **Property Listings**: Detailed property information with high-quality image carousels.
- **Advanced Search**: Filter by category (Apartment, House, Studio) and offer type (Rent, Sale).
- **Security Insights**: Area security scores and detailed safety features (CCTV, Guards, etc.) for every property.
- **Booking System**: Schedule property viewings directly through the app.
- **Payments**: Secure rent and deposit payment integration.
- **Communication**: Real-time messaging between landlords and tenants.
- **Landlord Dashboard**: Manage properties, track bookings, and view income reports.
- **Map View**: Visualize property locations with interactive maps.

## 🚀 Tech Stack

### Frontend
- **Framework**: React Native with Expo
- **Styling**: NativeWind (Tailwind CSS) & Vanilla CSS
- **Navigation**: React Navigation (Stack, Drawer, Bottom Tabs)
- **State/Data**: Axios, AsyncStorage
- **Maps**: React Native Maps

### Backend
- **Framework**: Node.js with Express
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens)
- **Media**: Cloudinary for image storage
- **Real-time**: Socket.io

## 📦 Project Structure

```bash
apato/
├── RealEstate/        # React Native Mobile App
└── backrealestate/    # Node.js API Backend
```

## 🛠️ Getting Started

### Prerequisites
- Node.js & npm
- Expo Go app on your mobile device (for testing)
- MongoDB account/instance

### Setup Backend
1. Navigate to the backend directory:
   ```bash
   cd backrealestate
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and add your credentials:
   ```env
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_name
   CLOUDINARY_API_KEY=your_key
   CLOUDINARY_API_SECRET=your_secret
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### Setup Frontend
1. Navigate to the frontend directory:
   ```bash
   cd RealEstate
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Update `config/Ip.jsx` with your local IP address:
   ```javascript
   export const BASE_URL = "http://YOUR_IP_ADDRESS:5000/api";
   ```
4. Start the Expo development server:
   ```bash
   npm start
   ```

## 📸 Screenshots

*(Use the `generate_image` tool to create beautiful mockups for your project!)*

## 📄 License
This project is licensed under the MIT License.
