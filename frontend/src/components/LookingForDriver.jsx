import React from 'react'

const LookingForDriver = (props) => {
    return (
        <div className="text-white">
            <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
                props.setVehicleFound(false)
            }}>
                <i className="text-3xl text-gray-400 ri-arrow-down-wide-line cursor-pointer"></i>
            </h5>
            <h3 className='text-2xl font-semibold mb-6 text-white'>Finding Pool Riders</h3>

            <div className='flex gap-4 justify-between flex-col items-center'>
                {/* Loading Animation */}
                <div className="relative bg-gray-800 rounded-2xl p-6 w-full flex justify-center">
                    <div className="relative">
                        <img className='h-20' src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg" alt="" />
                        {/* Animated Ring */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-28 h-28 border-4 border-gray-600 border-t-blue-500 rounded-full animate-spin"></div>
                        </div>
                    </div>
                </div>

                {/* Status Message */}
                <div className="w-full bg-blue-600/20 rounded-lg p-4 mt-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                            <i className="ri-search-line text-white text-sm"></i>
                        </div>
                        <div>
                            <h4 className="text-white font-medium">Searching for students...</h4>
                            <p className="text-blue-300 text-sm">Finding riders going your way</p>
                        </div>
                    </div>
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
                            <p className='text-sm text-gray-400 mt-1'>{props.pickup}</p>
                        </div>
                    </div>

                    {/* Destination */}
                    <div className='flex items-center gap-4 p-4 border-b border-gray-700'>
                        <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                            <i className="ri-map-pin-2-fill text-white"></i>
                        </div>
                        <div className="flex-1">
                            <h3 className='text-lg font-medium text-white'>Destination</h3>
                            <p className='text-sm text-gray-400 mt-1'>{props.destination}</p>
                        </div>
                    </div>

                    {/* Fare Details */}
                    <div className='flex items-center gap-4 p-4 border-b border-gray-700'>
                        <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                            <i className="ri-currency-line text-white"></i>
                        </div>
                        <div className="flex-1">
                            <h3 className='text-lg font-medium text-white'>₹{props.fare[ props.vehicleType ]}</h3>
                            <p className='text-sm text-gray-400 mt-1'>Split cost per person</p>
                        </div>
                    </div>

                    {/* Vehicle Type */}
                    <div className='flex items-center gap-4 p-4'>
                        <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center">
                            <i className="ri-car-line text-white"></i>
                        </div>
                        <div className="flex-1">
                            <h3 className='text-lg font-medium text-white'>
                                {props.vehicleType === 'car' ? 'Pool Car' : 
                                 props.vehicleType === 'moto' ? 'Pool Bike' : 'Pool Auto'}
                            </h3>
                            <p className='text-sm text-gray-400 mt-1'>Shared campus ride</p>
                        </div>
                    </div>
                </div>

                {/* Progress Indicators */}
                <div className="w-full mt-6 space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            <span className="text-gray-300 text-sm">Searching for riders</span>
                        </div>
                        <span className="text-gray-400 text-xs">30 sec</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                            <span className="text-gray-500 text-sm">Matching preferences</span>
                        </div>
                        <span className="text-gray-500 text-xs">--</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                            <span className="text-gray-500 text-sm">Confirming ride</span>
                        </div>
                        <span className="text-gray-500 text-xs">--</span>
                    </div>
                </div>

                {/* Cancel Button */}
                <button onClick={() => {
                    props.setVehicleFound(false)
                }} className='w-full mt-6 bg-transparent border border-gray-600 text-gray-300 font-medium py-3 rounded-lg hover:bg-gray-800 transition-colors duration-200'>
                    Cancel Search
                </button>
            </div>
        </div>
    )
}

export default LookingForDriver
