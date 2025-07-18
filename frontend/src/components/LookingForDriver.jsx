import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import { SocketContext } from '../context/SocketContext'

const LookingForDriver = (props) => {
    const [otp, setOtp] = useState('')
    const { socket } = useContext(SocketContext)

    // SINGLE useEffect for handling ride prop and OTP setting
    useEffect(() => {
        console.log('🔍 LookingForDriver received ride prop:', props.ride);
        console.log('🔐 OTP in props.ride:', props.ride?.otp);
        
        if (props.ride && props.ride.otp) {
            console.log('✅ Setting OTP:', props.ride.otp);
            setOtp(props.ride.otp);
        } else {
            console.log('❌ No OTP found in props.ride');
            console.log('- props.ride exists:', !!props.ride);
            console.log('- props.ride.otp exists:', !!props.ride?.otp);
        }
    }, [props.ride]);

    useEffect(() => {
        if (!socket) return;

        const handleRideAccepted = (data) => {
            console.log('Driver accepted ride:', data);
            props.setVehicleFound(false);
        };

        socket.on('ride-accepted', handleRideAccepted);

        return () => {
            socket.off('ride-accepted', handleRideAccepted);
        };
    }, [socket]);

    return (
        <div className="text-white">
            <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
                props.setVehicleFound(false)
            }}>
                <i className="text-3xl text-gray-400 ri-arrow-down-wide-line cursor-pointer"></i>
            </h5>

            <div className="mb-8">
                <h3 className='text-2xl font-semibold text-white mb-2'>Looking for a Driver</h3>
                <p className="text-gray-400 text-sm">Please wait while we find you a driver...</p>
            </div>

            {/* Debug OTP Section */}
            <div className="bg-red-600/20 border border-red-600/30 rounded-xl p-4 mb-4">
                <div className="text-center text-red-300 text-sm">
                    <p>Debug Info:</p>
                    <p>OTP State: {otp || 'No OTP'}</p>
                    <p>Props Ride: {props.ride ? 'Exists' : 'Null'}</p>
                    <p>Props OTP: {props.ride?.otp || 'No OTP in props'}</p>
                </div>
            </div>

            {/* OTP Display Section */}
            <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 border border-green-600/30 rounded-xl p-6 mb-8">
                <div className="text-center">
                    <div className="flex items-center justify-center mb-4">
                        <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mr-3">
                            <i className="ri-key-2-fill text-white text-xl"></i>
                        </div>
                        <h4 className="text-green-300 font-semibold text-lg">Your Ride OTP</h4>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4">
                        <h1 className='text-4xl font-bold text-white tracking-[0.3em] font-mono'>
                            {otp || 'Loading...'}
                        </h1>
                    </div>
                    <div className="space-y-2 text-green-300 text-sm">
                        <div className="flex items-center justify-center">
                            <i className="ri-information-line mr-2"></i>
                            <span>Share this OTP with your driver to start the ride</span>
                        </div>
                        <div className="flex items-center justify-center">
                            <i className="ri-shield-check-line mr-2"></i>
                            <span>Keep this code secure until pickup</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Loading Animation */}
            <div className="flex justify-center mb-8">
                <div className="relative">
                    <div className="w-20 h-20 border-4 border-gray-600 border-t-green-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <i className="ri-car-line text-green-500 text-2xl"></i>
                    </div>
                </div>
            </div>

            {/* Trip Details */}
            <div className='w-full mb-8'>
                <div className='flex items-center gap-4 p-4 border-b border-gray-700'>
                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                        <i className="ri-map-pin-user-fill text-white"></i>
                    </div>
                    <div className="flex-1">
                        <h3 className='text-lg font-medium text-white'>From</h3>
                        <p className='text-sm text-gray-400 mt-1'>{props.pickup}</p>
                    </div>
                </div>
                
                <div className='flex items-center gap-4 p-4 border-b border-gray-700'>
                    <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                        <i className="ri-map-pin-2-fill text-white"></i>
                    </div>
                    <div className="flex-1">
                        <h3 className='text-lg font-medium text-white'>To</h3>
                        <p className='text-sm text-gray-400 mt-1'>{props.destination}</p>
                    </div>
                </div>
                
                <div className='flex items-center gap-4 p-4'>
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                        <i className="ri-currency-line text-white"></i>
                    </div>
                    <div className="flex-1">
                        <h3 className='text-lg font-medium text-white'>₹{props.fare?.[props.vehicleType] || '0'}</h3>
                        <p className='text-sm text-gray-400 mt-1'>Split fare - {props.vehicleType}</p>
                    </div>
                </div>
            </div>

            {/* Status Messages */}
            <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-white font-medium">Looking for nearby drivers...</span>
                </div>
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-white font-medium">OTP ready for driver</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                    <span className="text-gray-400">Waiting for driver acceptance...</span>
                </div>
            </div>

            {/* Cancel Button */}
            <button 
                onClick={() => props.setVehicleFound(false)}
                className="w-full bg-transparent border border-gray-600 text-gray-300 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200"
            >
                Cancel Search
            </button>
        </div>
    )
}

export default LookingForDriver
