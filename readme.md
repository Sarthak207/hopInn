# hopIn - College Ride Pooling Application

<div align="center">
  <img src="https://via.placeholder.com/128x128/000000/FFFFFF?text=hopIn" alt="hopIn Logo" width="128" height="128">
  <p><em>Safe rides for college students</em></p>
  
  [![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
  [![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com/)
  [![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io/)
  [![Google Maps](https://img.shields.io/badge/Google_Maps-4285F4?style=for-the-badge&logo=google-maps&logoColor=white)](https://developers.google.com/maps)
</div>

## 🚗 About hopIn

hopIn is a modern ride-pooling application designed specifically for college students. It provides a safe, cost-effective way for students to share rides around campus and beyond, featuring real-time tracking, secure payment processing, and a verified student network.

## ✨ Features

### 🎓 Student-Focused
- **Verified Student Network** - Only college students can join
- **Campus-Specific Locations** - Pre-loaded with common campus destinations
- **Split Fare System** - Share costs with fellow students
- **Student Driver Program** - Earn money while helping classmates

### 🔒 Safety & Security
- **Real-time Location Tracking** - Live GPS tracking during rides
- **OTP Verification** - Secure ride confirmation system
- **Driver Verification** - Background checks for all drivers
- **24/7 Support** - Round-the-clock safety monitoring

### 📱 Modern UI/UX
- **Dark Theme Interface** - Modern, eye-friendly design
- **Responsive Design** - Works seamlessly on all devices
- **Real-time Updates** - Live ride status and driver location
- **Intuitive Navigation** - Easy-to-use interface

### 🌐 Advanced Technology
- **Google Maps Integration** - Accurate location services and routing
- **Socket.io Real-time Communication** - Instant updates and notifications
- **MongoDB Geospatial Queries** - Efficient driver matching
- **JWT Authentication** - Secure user sessions

## 🖼️ Screenshots

### Landing Page
<img src="https://via.placeholder.com/800x600/000000/FFFFFF?text=hopIn+Landing+Page" alt="hopIn Landing Page" width="800">

*Clean, modern landing page with college-focused messaging*

### Student Dashboard
<img src="https://via.placeholder.com/800x600/1a1a1a/FFFFFF?text=Student+Dashboard" alt="Student Dashboard" width="800">

*Dark theme dashboard with location search and ride booking*

### Driver Dashboard
<img src="https://via.placeholder.com/800x600/1a1a1a/FFFFFF?text=Driver+Dashboard" alt="Driver Dashboard" width="800">

*Professional driver interface with earnings tracking and ride management*

### Ride Booking Flow
<div align="center">
  <img src="https://via.placeholder.com/300x600/1a1a1a/FFFFFF?text=Location+Search" alt="Location Search" width="250">
  <img src="https://via.placeholder.com/300x600/1a1a1a/FFFFFF?text=Vehicle+Selection" alt="Vehicle Selection" width="250">
  <img src="https://via.placeholder.com/300x600/1a1a1a/FFFFFF?text=Ride+Confirmation" alt="Ride Confirmation" width="250">
</div>

*Seamless ride booking process from location search to confirmation*

## 🛠️ Tech Stack

### Frontend
- **React.js** - Modern JavaScript framework
- **Tailwind CSS** - Utility-first CSS framework
- **GSAP** - High-performance animations
- **Axios** - HTTP client for API calls
- **React Router** - Client-side routing

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Socket.io** - Real-time communication
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing

### External APIs
- **Google Maps API** - Location services
- **Google Places API** - Autocomplete suggestions
- **Google Distance Matrix API** - Route calculations

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB instance
- Google Cloud Platform account
- Git


## 🔄 User Flow

### For Students
1. **Sign Up** - Create account with college email
2. **Login** - Access student dashboard
3. **Book Ride** - Enter pickup and destination
4. **Select Vehicle** - Choose from available pool options
5. **Confirm Ride** - Review details and confirm
6. **Track Driver** - Real-time location updates
7. **Complete Ride** - Pay and rate the experience

### For Drivers
1. **Sign Up** - Register as driver with vehicle details
2. **Go Online** - Start accepting ride requests
3. **Accept Rides** - View and accept nearby requests
4. **Pick Up Students** - Navigate to pickup location
5. **Verify OTP** - Confirm passenger identity
6. **Complete Ride** - Navigate to destination and complete trip

## 🔧 API Endpoints

### Authentication
- `POST /users/register` - Student registration
- `POST /users/login` - Student login
- `POST /captains/register` - Driver registration
- `POST /captains/login` - Driver login

### Rides
- `POST /rides/create` - Create new ride request
- `GET /rides/get-fare` - Calculate ride fare
- `POST /rides/confirm` - Confirm ride (driver)
- `GET /rides/start-ride` - Start ride with OTP

### Maps
- `GET /maps/get-suggestions` - Location autocomplete
- `GET /maps/get-coordinates` - Get coordinates from address
- `GET /maps/get-distance-time` - Calculate route details

## 🎯 Key Features Implementation

### Real-time Communication
// Socket.io integration for live updates
socket.on('new-ride', (data) => {
// Driver receives new ride request
});

socket.on('ride-confirmed', (ride) => {
// Student gets driver confirmation
});

### Location Services
// Google Maps integration
const suggestions = await mapService.getAutoCompleteSuggestions(input);
const fare = await mapService.getDistanceTime(origin, destination);

### Authentication
// JWT token authentication
const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

## 🎨 Design Philosophy

### Dark Theme
- Modern, professional appearance
- Reduced eye strain during night rides
- Better battery life on mobile devices
- Consistent with popular ride-sharing apps

### Mobile-First
- Responsive design for all screen sizes
- Touch-friendly interface elements
- Optimized for mobile usage patterns
- Fast loading and smooth animations
