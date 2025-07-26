/**************************************************************************************************
 *  services/ride.service.js                                                                      *
 *  Central ride-handling service                                                                *
 *  –  Campus & external fare calculation                                                       *
 *  –  Ride CRUD / status updates                                                               *
 *  –  Real-time socket events                                                                  *
 *************************************************************************************************/

const crypto      = require('crypto');
const rideModel   = require('../models/ride.model');
const captainModel = require('../models/captain.model');
const userModel   = require('../models/user.model');
const mapService  = require('./maps.service');
const { sendMessageToSocketId } = require('../socket');
const mongoose    = require('mongoose');

/* ────────────────────────────────────────────────────────────────────────── *
 *  1. HELPER: straight-line (Haversine) distance in metres                  *
 * ────────────────────────────────────────────────────────────────────────── */
function haversine(lat1, lon1, lat2, lon2) {
  const R  = 6371_000;                                       // metres
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a  = Math.sin(Δφ / 2) ** 2 +
             Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); // metres
}

/* ────────────────────────────────────────────────────────────────────────── *
 *  2. CAMPUS-ONLY FARE (IIT-B)                                              *
 * ────────────────────────────────────────────────────────────────────────── */
async function getCampusFare(campusPickup, campusDestination) {
  const d = haversine(
    campusPickup.coordinates.latitude,
    campusPickup.coordinates.longitude,
    campusDestination.coordinates.latitude,
    campusDestination.coordinates.longitude
  );

  const km            = d / 1000;
  const estMinutes    = Math.max(2, Math.ceil(km * 3));      // 3-min/km on campus
  const baseFare      = { auto: 15, car: 25, moto: 10 };
  const perKm         = { auto:  5, car:  8, moto:  3 };

  return {
    auto: Math.round(baseFare.auto + km * perKm.auto + estMinutes * 1),
    car : Math.round(baseFare.car  + km * perKm.car  + estMinutes * 1.5),
    moto: Math.round(baseFare.moto + km * perKm.moto + estMinutes * 0.5)
  };
}

/* ────────────────────────────────────────────────────────────────────────── *
 *  3. EXTERNAL FARE (Google DistanceMatrix)                                 *
 * ────────────────────────────────────────────────────────────────────────── */
async function getExternalFare(pickup, destination) {
  const distTime = await mapService.getDistanceTime(pickup, destination); // can throw

  const base = { auto: 30, car: 50, moto: 20 };
  const perK = { auto: 10, car: 15, moto:  8 };
  const perM = { auto:  2, car:  3, moto: 1.5 };

  const km  = distTime.distance.value  / 1000;
  const min = distTime.duration.value / 60;

  return {
    auto: Math.round(base.auto + km * perK.auto + min * perM.auto),
    car : Math.round(base.car  + km * perK.car  + min * perM.car ),
    moto: Math.round(base.moto + km * perK.moto + min * perM.moto)
  };
}

module.exports.getFare = getExternalFare;  // exported for any legacy use

/* ────────────────────────────────────────────────────────────────────────── *
 *  4. OTP generator                                                         *
 * ────────────────────────────────────────────────────────────────────────── */
const genOtp = (n = 6) =>
  crypto.randomInt(10 ** (n - 1), 10 ** n).toString();

/* ────────────────────────────────────────────────────────────────────────── *
 *  5. CREATE RIDE - COMPLETE WITH NOTIFICATION SYSTEM                      *
 * ────────────────────────────────────────────────────────────────────────── */
module.exports.createRide = async ({
  user, pickup, destination, vehicleType,
  campusPickup = null, campusDestination = null
}) => {

  if (!user || !pickup || !destination || !vehicleType)
    throw new Error('All fields are required');

  /* choose fare engine */
  const fareTable = (campusPickup && campusDestination)
      ? await getCampusFare(campusPickup, campusDestination)
      : await getExternalFare(pickup, destination);

  // Convert locationId strings to ObjectIds for campus locations
  let processedCampusPickup = null;
  let processedCampusDestination = null;

  if (campusPickup) {
    processedCampusPickup = {
      ...campusPickup,
      locationId: campusPickup.locationId ? 
        new mongoose.Types.ObjectId(campusPickup.locationId) : 
        null
    };
  }

  if (campusDestination) {
    processedCampusDestination = {
      ...campusDestination,
      locationId: campusDestination.locationId ? 
        new mongoose.Types.ObjectId(campusDestination.locationId) : 
        null
    };
  }

  const ride = await rideModel.create({
    user,
    pickup,
    destination,
    vehicleType,
    fare : fareTable[vehicleType],
    otp  : genOtp(), // Always generate OTP in backend
    campusPickup: processedCampusPickup,
    campusDestination: processedCampusDestination,
    status: 'pending'
  });

  console.log('🔐 Generated OTP:', ride.otp);
  
  // Real-time broadcast to captains in radius (campus rides only)
  if (campusPickup && campusDestination) {
    console.log('🔍 Looking for captains near campus location...');
    console.log('📍 Pickup coordinates:', campusPickup.coordinates);
    
    try {
      // Get user data first
      const userData = await userModel.findById(user).select('fullname email');
      console.log('👤 User data:', userData);

      // Check ALL captains first
      const allCaptains = await captainModel.find({}).select('_id fullname socketId status');
      console.log(`📊 Total captains in database: ${allCaptains.length}`);
      
      allCaptains.forEach(captain => {
        console.log(`👤 Captain ${captain.fullname.firstname}: status=${captain.status}, socketId=${captain.socketId}`);
      });

      // Get active captains with socketId
      const captains = await captainModel.find({
        status: 'active',
        socketId: { $exists: true, $ne: null }
      }).select('_id fullname vehicle socketId');

      console.log(`🚗 Found ${captains.length} active captains with socketId`);
      
      if (captains.length === 0) {
        console.log('❌ No active captains found! Checking reasons...');
        
        // Check captains without socketId
        const captainsWithoutSocket = await captainModel.find({
          status: 'active',
          $or: [
            { socketId: { $exists: false } },
            { socketId: null },
            { socketId: '' }
          ]
        }).select('_id fullname status');
        
        console.log(`⚠️  Active captains without socketId: ${captainsWithoutSocket.length}`);
        
        // Check inactive captains
        const inactiveCaptains = await captainModel.find({
          status: { $ne: 'active' }
        }).select('_id fullname status');
        
        console.log(`😴 Inactive captains: ${inactiveCaptains.length}`);
      }

      captains.forEach(captain => {
        console.log(`👤 Captain ${captain.fullname.firstname}: socketId=${captain.socketId}`);
      });

      for (const captain of captains) {
        console.log(`📤 Sending ride notification to captain: ${captain.fullname.firstname} (${captain.socketId})`);
        
        try {
          sendMessageToSocketId(captain.socketId, {
            event: 'new-ride',
            data: {
              rideId: ride._id,
              user: userData,
              pickup,
              destination,
              fare: ride.fare,
              vehicleType,
              otp: ride.otp,
              campusPickup: processedCampusPickup,
              campusDestination: processedCampusDestination,
              message: `New ride request from ${pickup} to ${destination}`
            }
          });
          console.log(`✅ Notification sent to captain ${captain.fullname.firstname}`);
        } catch (error) {
          console.error(`❌ Error sending notification to captain ${captain.fullname.firstname}:`, error);
        }
      }
    } catch (error) {
      console.error('❌ Error finding captains:', error);
    }
  } else {
    console.log('⚠️  Not a campus ride - campusPickup or campusDestination missing');
    console.log('campusPickup:', campusPickup);
    console.log('campusDestination:', campusDestination);
  }

  return ride;
};

/* ────────────────────────────────────────────────────────────────────────── *
 *  6. CONFIRM, START, END, CANCEL                                           *
 * ────────────────────────────────────────────────────────────────────────── */
module.exports.confirmRide = async ({ rideId, captain }) => {
  if (!rideId) throw new Error('Ride id is required');

  await rideModel.updateOne({ _id: rideId }, {
    status : 'accepted',
    captain: captain._id
  });

  const ride = await rideModel
    .findById(rideId)
    .populate('user')
    .populate('captain')
    .select('+otp');

  if (!ride) throw new Error('Ride not found');

  global.io?.to(ride.user._id.toString()).emit('ride-confirmed', {
    rideId: ride._id,
    captain: {
      _id     : ride.captain._id,
      fullname: ride.captain.fullname,
      vehicle : ride.captain.vehicle,
      phone   : ride.captain.phone
    },
    otp: ride.otp
  });

  return ride;
};

module.exports.startRide = async ({ rideId, otp, captain }) => {
  if (!rideId || !otp) throw new Error('Ride id and OTP required');

  const ride = await rideModel
    .findById(rideId)
    .populate('user')
    .populate('captain')
    .select('+otp');

  if (!ride)           throw new Error('Ride not found');
  if (ride.status!=='accepted') throw new Error('Ride not accepted');
  if (ride.otp !== otp)         throw new Error('Invalid OTP');

  await rideModel.updateOne({ _id: rideId }, { status: 'ongoing' });

  global.io?.to(ride.user._id.toString())
           .emit('ride-started', { rideId, status:'ongoing' });

  return ride;
};

module.exports.endRide = async ({ rideId, captain }) => {
  if (!rideId) throw new Error('Ride id required');

  const ride = await rideModel
    .findOne({ _id: rideId, captain: captain._id })
    .populate('user')
    .populate('captain');

  if (!ride)                 throw new Error('Ride not found');
  if (ride.status!=='ongoing') throw new Error('Ride not ongoing');

  await rideModel.updateOne({ _id: rideId }, { status:'completed' });

  global.io?.to(ride.user._id.toString())
           .emit('ride-completed', { rideId, status:'completed' });

  return ride;
};

module.exports.cancelRide = async ({ rideId, userId }) => {
  if (!rideId) throw new Error('Ride id required');

  const ride = await rideModel.findOne({ _id: rideId, user: userId });
  if (!ride) throw new Error('Ride not found');

  if (!['pending','accepted'].includes(ride.status))
    throw new Error('Cannot cancel after ride has started');

  await rideModel.updateOne({ _id: rideId }, { status:'cancelled' });

  if (ride.captain)
    global.io?.to(ride.captain._id.toString())
             .emit('ride-cancelled', { rideId, message:'Cancelled by user' });

  return ride;
};

/* ────────────────────────────────────────────────────────────────────────── *
 *  7. DASHBOARD HELPERS                                                     *
 * ────────────────────────────────────────────────────────────────────────── */
module.exports.getNearbyRides = async () =>
  rideModel
    .find({ status:'pending' })
    .populate('user')
    .sort({ createdAt:-1 })
    .limit(10);

module.exports.getRideHistory = async (userId) =>
  rideModel
    .find({ user: userId })
    .populate('captain','fullname vehicle')
    .sort({ createdAt:-1 });
