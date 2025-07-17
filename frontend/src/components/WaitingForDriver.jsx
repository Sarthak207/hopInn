import React, { useState, useEffect } from 'react'
import { useContext } from 'react'
import { SocketContext } from '../context/SocketContext'
import RouteVisualization from './RouteVisualization'

const WaitingForDriver = (props) => {
  const [driverLocation, setDriverLocation] = useState(null)
  const [eta, setEta] = useState(null)
  const [rideStatus, setRideStatus] = useState('confirmed')
  const { socket } = useContext(SocketContext)

  useEffect(() => {
    if (!socket || !props.ride) return

    const handleDriverLocationUpdate = (data) => {
      setDriverLocation({
        latitude: data.location.ltd,
        longitude: data.location.lng
      })
      setEta(data.eta)
    }

    const handleRideStatusUpdate = (data) => {
      setRideStatus(data.status)
      if (data.status === 'started') {
        props.setWaitingForDriver(false)
        // Navigate to ride tracking page
      }
    }

    socket.on('driver-location-update', handleDriverLocationUpdate)
    socket.on('ride-status-update', handleRideStatusUpdate)

    return () => {
      socket.off('driver-location-update', handleDriverLocationUpdate)
      socket.off('ride-status-update', handleRideStatusUpdate)
    }
  }, [socket, props.ride])

  const cancelRide = () => {
    if (socket && props.ride) {
      socket.emit('cancel-ride', { rideId: props.ride._id })
    }
    props.setWaitingForDriver(false)
    props.setVehicleFound(false)
  }

  const getPickupLocation = () => {
    if (props.ride?.campusPickup) {
      return props.ride.campusPickup
    }
    return null
  }

  const getDestinationLocation = () => {
    if (props.ride?.campusDestination) {
      return props.ride.campusDestination
    }
    return null
  }

  const pickupLocation = getPickupLocation()
  const destinationLocation = getDestinationLocation()

  return (
    <div className="text-white">
      <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
        props.setWaitingForDriver(false)
      }}>
        <i className="text-3xl text-gray-400 ri-arrow-down-wide-line cursor-pointer"></i>
      </h5>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className='text-2xl font-semibold text-white'>Driver En Route</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-500 text-sm">Live</span>
          </div>
        </div>
        <p className="text-gray-400 text-sm">Your pool ride is confirmed</p>
      </div>

      {/* Live Tracking Map */}
      {pickupLocation && destinationLocation && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-white font-medium">Live Tracking</h4>
            {eta && (
              <span className="text-green-500 text-sm">ETA: {eta}</span>
            )}
          </div>
          <RouteVisualization
            pickup={pickupLocation}
            destination={destinationLocation}
            driverLocation={driverLocation}
            showRoute={true}
          />
        </div>
      )}

      {/* Driver Info Card */}
      <div className='bg-gray-800 rounded-xl p-4 mb-6'>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center gap-3'>
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {props.ride?.captain?.fullname?.firstname?.charAt(0) || 'D'}
              </span>
            </div>
            <div>
              <h2 className='text-lg font-medium text-white capitalize'>
                {props.ride?.captain?.fullname?.firstname} {props.ride?.captain?.fullname?.lastname}
              </h2>
              <p className='text-sm text-gray-400'>
                {props.ride?.captain?.vehicle?.color} {props.ride?.captain?.vehicle?.vehicleType}
              </p>
            </div>
          </div>
          <div className='text-right'>
            <h4 className='text-lg font-semibold text-white'>
              {props.ride?.captain?.vehicle?.plate}
            </h4>
            <div className="flex items-center gap-1 mt-1">
              <i className="ri-star-fill text-yellow-400 text-sm"></i>
              <span className="text-gray-400 text-sm">4.8</span>
            </div>
          </div>
        </div>
        
        {/* Vehicle Image */}
        <div className="flex justify-center mb-4">
          <img className='h-16' src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg" alt="" />
        </div>
      </div>

      {/* OTP Section */}
      <div className="bg-blue-600/20 border border-blue-600/30 rounded-xl p-4 mb-6">
        <div className="text-center">
          <h4 className="text-blue-300 font-medium mb-2">Ride OTP</h4>
          <h1 className='text-3xl font-bold text-blue-400 tracking-wider'>
            {props.ride?.otp || '----'}
          </h1>
          <p className="text-blue-300 text-sm mt-2">Share this code with your driver</p>
        </div>
      </div>

      {/* Trip Details */}
      <div className='w-full mb-6'>
        {/* Pickup Location */}
        <div className='flex items-center gap-4 p-4 border-b border-gray-700'>
          <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
            <i className="ri-map-pin-user-fill text-white"></i>
          </div>
          <div className="flex-1">
            <h3 className='text-lg font-medium text-white'>Pickup</h3>
            <p className='text-sm text-gray-400 mt-1'>
              {pickupLocation?.name || props.ride?.pickup}
            </p>
            {pickupLocation?.type && (
              <span className="inline-block px-2 py-1 text-xs bg-green-600 text-white rounded-full mt-1">
                {pickupLocation.type}
              </span>
            )}
          </div>
        </div>

        {/* Destination */}
        <div className='flex items-center gap-4 p-4 border-b border-gray-700'>
          <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
            <i className="ri-map-pin-2-fill text-white"></i>
          </div>
          <div className="flex-1">
            <h3 className='text-lg font-medium text-white'>Destination</h3>
            <p className='text-sm text-gray-400 mt-1'>
              {destinationLocation?.name || props.ride?.destination}
            </p>
            {destinationLocation?.type && (
              <span className="inline-block px-2 py-1 text-xs bg-red-600 text-white rounded-full mt-1">
                {destinationLocation.type}
              </span>
            )}
          </div>
        </div>

        {/* Fare */}
        <div className='flex items-center gap-4 p-4'>
          <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
            <i className="ri-currency-line text-white"></i>
          </div>
          <div className="flex-1">
            <h3 className='text-lg font-medium text-white'>₹{props.ride?.fare || '0'}</h3>
            <p className='text-sm text-gray-400 mt-1'>Split fare - Pay on arrival</p>
          </div>
        </div>
      </div>

      {/* Status Updates */}
      <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-white font-medium">Driver confirmed</span>
        </div>
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-3 h-3 rounded-full ${driverLocation ? 'bg-green-500 animate-pulse' : 'bg-blue-500 animate-pulse'}`}></div>
          <span className="text-white font-medium">En route to pickup</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
          <span className="text-gray-400">
            {eta ? `Arriving in ${eta}` : 'Calculating arrival time...'}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button 
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200"
          onClick={() => window.open(`tel:${props.ride?.captain?.phone}`, '_self')}
        >
          <i className="ri-phone-line mr-2"></i>
          Call Driver
        </button>
        
        <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200">
          <i className="ri-message-2-line mr-2"></i>
          Message Driver
        </button>
        
        <button 
          onClick={cancelRide}
          className="w-full bg-transparent border border-gray-600 text-gray-300 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200"
        >
          Cancel Ride
        </button>
      </div>
    </div>
  )
}

export default WaitingForDriver
