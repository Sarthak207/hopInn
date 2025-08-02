const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
const connectToDb = require('./db/db');
const userRoutes = require('./routes/user.routes');
const captainRoutes = require('./routes/captain.routes');
const mapsRoutes = require('./routes/maps.routes');
const rideRoutes = require('./routes/ride.routes');
const campusRoutes = require('./routes/campus.routes');
const debugRoutes = require('./routes/debug.routes');
const path= require("path");
//const serverless = require('serverless-http');

connectToDb();

const allowedOrigins = [
  'https://hop-inn.vercel.app',
  'http://localhost:3000'
];
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));


app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use('/users', userRoutes);
app.use('/campus', campusRoutes);
app.use('/debug', debugRoutes);
app.use('/captains', captainRoutes);
app.use('/maps', mapsRoutes);
app.use('/rides', rideRoutes);


const __dirname1= path.resolve();
if(process.env.NODE_ENV=="production"){
  app.use(express.static(path.join(__dirname1,"/frontend/dist")));

  app.get('*',(req,res)=>{
    res.sendFile(path.resolve(__dirname1,"frontend","dist","index.html"));
  })
}else{
  app.get("/",(req,res)=>{
    res.send("API is Running successfully");
  });
}

module.exports = app;
