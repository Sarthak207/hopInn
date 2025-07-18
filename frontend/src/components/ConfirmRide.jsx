import React, { useState } from 'react'
import RouteVisualization from './RouteVisualization'

const ConfirmRide = (props) => {
    const [isCreatingRide, setIsCreatingRide] = useState(false)
    const [routeInfo, setRouteInfo] = useState(null)

    const handleCreateRide = async () => {
        setIsCreatingRide(true)
        try {
            console.log('🔄 Creating ride...')
            const response = await props.createRide()
            
            console.log('📦 API Response:', response?.data)
            console.log('🚗 Ride object:', response?.data?.ride)
            console.log('🔐 OTP from API:', response?.data?.ride?.otp)
            
            if (response?.data?.ride) {
                // THIS WAS MISSING! Store the ride data
                props.setCreatedRide(response.data.ride)
                console.log('✅ setCreatedRide called with:', response.data.ride)
            }
            
            props.setConfirmRidePanel(false)
            props.setVehicleFound(true)
        } catch (error) {
            console.error('Error creating ride:', error)
        } finally {
            setIsCreatingRide(false)
        }
    }

    const handleRouteCalculated = (routeData) => {
        setRouteInfo(routeData)
    }

    // Convert pickup/destination strings to objects if they're not already
    const pickupLocation = typeof props.pickup === 'string' ? null : props.pickup
    const destinationLocation = typeof props.destination === 'string' ? null : props.destination

    return (
        <div className="text-white">
            <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
                props.setConfirmRidePanel(false)
            }}>
                <i className="text-3xl text-gray-400 ri-arrow-down-wide-line cursor-pointer"></i>
            </h5>
            <h3 className='text-2xl font-semibold mb-6 text-white'>Confirm Pool Ride</h3>

            <div className='flex gap-4 justify-between flex-col items-center'>
                {/* Route Visualization */}
                {pickupLocation && destinationLocation && (
                    <div className="w-full mb-4">
                        <h4 className="text-white font-medium mb-3">Route Preview</h4>
                        <RouteVisualization
                            pickup={pickupLocation}
                            destination={destinationLocation}
                            showRoute={true}
                            onRouteCalculated={handleRouteCalculated}
                        />
                    </div>
                )}

                {/* Vehicle Image */}
                <div className="bg-gray-800 rounded-2xl p-4 w-full flex justify-center">
                    <img className='h-20' src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg" alt="" />
                </div>

                {/* Trip Details */}
                <div className='w-full mt-4'>
                    {/* Pickup Location */}
                    <div className='flex items-center gap-4 p-4 border-b border-gray-700'>
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                            <i className="ri-map-pin-user-fill text-white"></i>
                        </div>
                        <div className="flex-1">
                            <h3 className='text-lg font-medium text-white'>Pickup</h3>
                            <p className='text-sm text-gray-400 mt-1'>
                                {pickupLocation?.name || props.pickup}
                            </p>
                            {pickupLocation?.type && (
                                <span className="inline-block px-2 py-1 text-xs bg-blue-600 text-white rounded-full mt-1">
                                    {pickupLocation.type}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Destination */}
                    <div className='flex items-center gap-4 p-4 border-b border-gray-700'>
                        <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                            <i className="ri-map-pin-2-fill text-white"></i>
                        </div>
                        <div className="flex-1">
                            <h3 className='text-lg font-medium text-white'>Destination</h3>
                            <p className='text-sm text-gray-400 mt-1'>
                                {destinationLocation?.name || props.destination}
                            </p>
                            {destinationLocation?.type && (
                                <span className="inline-block px-2 py-1 text-xs bg-green-600 text-white rounded-full mt-1">
                                    {destinationLocation.type}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Route Information */}
                    {routeInfo && (
                        <div className='flex items-center gap-4 p-4 border-b border-gray-700'>
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                                <i className="ri-route-line text-white"></i>
                            </div>
                            <div className="flex-1">
                                <h3 className='text-lg font-medium text-white'>Route Info</h3>
                                <p className='text-sm text-gray-400 mt-1'>
                                    {routeInfo.distance} • {routeInfo.duration}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Fare Details */}
                    <div className='flex items-center gap-4 p-4 border-b border-gray-700'>
                        <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                            <i className="ri-currency-line text-white"></i>
                        </div>
                        <div className="flex-1">
                            <h3 className='text-lg font-medium text-white'>₹{props.fare[ props.vehicleType ]}</h3>
                            <p className='text-sm text-gray-400 mt-1'>Split fare with students</p>
                        </div>
                    </div>

                    {/* Ride Type */}
                    <div className='flex items-center gap-4 p-4'>
                        <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center">
                            <i className="ri-group-line text-white"></i>
                        </div>
                        <div className="flex-1">
                            <h3 className='text-lg font-medium text-white'>
                                {props.vehicleType === 'car' ? 'Pool Car' : 
                                 props.vehicleType === 'moto' ? 'Pool Bike' : 'Pool Auto'}
                            </h3>
                            <p className='text-sm text-gray-400 mt-1'>Shared ride with students</p>
                        </div>
                    </div>
                </div>

                {/* Safety Notice */}
                <div className="w-full bg-gray-800/50 rounded-lg p-4 mt-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                            <i className="ri-shield-check-line text-white text-sm"></i>
                        </div>
                        <div>
                            <h4 className="text-white font-medium">Student Safety</h4>
                            <p className="text-gray-400 text-sm">Verified campus riders only</p>
                        </div>
                    </div>
                </div>

                {/* Confirm Button */}
                <button 
                    onClick={handleCreateRide}
                    disabled={isCreatingRide}
                    className='w-full mt-6 bg-white text-black font-semibold py-4 rounded-lg hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                    {isCreatingRide ? 'Creating Ride...' : 'Confirm Pool Ride'}
                </button>

                {/* Cancel Option */}
                <button onClick={() => {
                    props.setConfirmRidePanel(false)
                }} className='w-full mt-2 bg-transparent border border-gray-600 text-gray-300 font-medium py-3 rounded-lg hover:bg-gray-800 transition-colors duration-200'>
                    Cancel
                </button>
            </div>
        </div>
    )
}

export default ConfirmRide
