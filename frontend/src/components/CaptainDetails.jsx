import React, { useContext } from 'react'
import { CaptainDataContext } from '../context/CapatainContext'

const CaptainDetails = () => {

    const { captain } = useContext(CaptainDataContext)

    return (
        <div>
            {/* Driver Profile Header */}
            <div className='flex items-center justify-between mb-6'>
                <div className='flex items-center justify-start gap-3'>
                    <div className="relative">
                        <img className='h-12 w-12 rounded-full object-cover border-2 border-gray-700' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdlMd7stpWUCmjpfRjUsQ72xSWikidbgaI1w&s" alt="" />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900"></div>
                    </div>
                    <div>
                        <h4 className='text-lg font-medium text-white capitalize'>
                            {captain.fullname.firstname + " " + captain.fullname.lastname}
                        </h4>
                        <p className='text-sm text-gray-400'>Driver • hopIn</p>
                    </div>
                </div>
                <div className="text-right">
                    <h4 className='text-xl font-semibold text-green-400'>₹295.20</h4>
                    <p className='text-sm text-gray-400'>Today's Earnings</p>
                </div>
            </div>

            {/* Driver Stats Cards */}
            <div className='grid grid-cols-3 gap-3 mb-6'>
                <div className='text-center bg-gray-800 rounded-xl p-4'>
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                        <i className="text-lg text-white ri-timer-2-line"></i>
                    </div>
                    <h5 className='text-lg font-semibold text-white'>6.5</h5>
                    <p className='text-xs text-gray-400'>Hours Online</p>
                </div>
                <div className='text-center bg-gray-800 rounded-xl p-4'>
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                        <i className="text-lg text-white ri-car-line"></i>
                    </div>
                    <h5 className='text-lg font-semibold text-white'>24</h5>
                    <p className='text-xs text-gray-400'>Total Rides</p>
                </div>
                <div className='text-center bg-gray-800 rounded-xl p-4'>
                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                        <i className="text-lg text-white ri-thumb-up-line"></i>
                    </div>
                    <h5 className='text-lg font-semibold text-white'>95%</h5>
                    <p className='text-xs text-gray-400'>Acceptance</p>
                </div>
            </div>

            {/* Vehicle Information */}
            <div className="bg-gray-800 rounded-xl p-4 mb-4">
                <h5 className="text-white font-medium mb-3">Vehicle Details</h5>
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span className="text-gray-400 text-sm">Vehicle</span>
                        <span className="text-white text-sm">{captain.vehicle.color} {captain.vehicle.vehicleType}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400 text-sm">License Plate</span>
                        <span className="text-white text-sm font-mono">{captain.vehicle.plate}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400 text-sm">Capacity</span>
                        <span className="text-white text-sm">{captain.vehicle.capacity} passengers</span>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
                <button className="bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200">
                    <i className="ri-history-line mr-2"></i>
                    Ride History
                </button>
                <button className="bg-gray-800 border border-gray-700 text-white py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors duration-200">
                    <i className="ri-settings-3-line mr-2"></i>
                    Settings
                </button>
            </div>

            {/* Status Toggle */}
            <div className="mt-4 bg-gray-800 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h5 className="text-white font-medium">Driver Status</h5>
                        <p className="text-gray-400 text-sm">Available for student rides</p>
                    </div>
                    <div className="flex items-center">
                        <div className="w-12 h-6 bg-green-600 rounded-full p-1 cursor-pointer">
                            <div className="w-4 h-4 bg-white rounded-full transform translate-x-6 transition-transform duration-200"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CaptainDetails
