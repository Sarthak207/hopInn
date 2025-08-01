import React from 'react'

const VehiclePanel = (props) => {
    const handleVehicleSelect = (vehicleType) => {
        // Set the selected vehicle type
        props.selectVehicle(vehicleType)
        
        // Close vehicle panel
        props.setVehiclePanel(false)
        
        // Open confirm ride panel after a short delay
        setTimeout(() => {
            props.setConfirmRidePanel(true)
        }, 300)
    }

    return (
        <div className="text-white">
            <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
                props.setVehiclePanel(false)
            }}>
                <i className="text-3xl text-gray-400 ri-arrow-down-wide-line"></i>
            </h5>
            <h3 className='text-2xl font-semibold mb-6 text-white'>Choose a Ride</h3>
            
            {/* Pool Car Option */}
            <div onClick={() => handleVehicleSelect('car')} className='flex border-2 border-gray-700 hover:border-gray-600 active:border-white mb-3 rounded-xl w-full p-4 items-center justify-between bg-gray-800/50 cursor-pointer'>
                <img className='h-12' src="https://www.pngplay.com/wp-content/uploads/8/Uber-PNG-Photos.png" alt="" />
                <div className='ml-3 flex-1'>
                    <h4 className='font-medium text-base text-white'>Pool Car <span className="text-gray-400"><i className="ri-user-3-fill"></i>4</span></h4>
                    <h5 className='font-medium text-sm text-gray-300'>2 mins away</h5>
                    <p className='font-normal text-xs text-gray-400'>Split costs with students</p>
                </div>
                <h2 className='text-xl font-semibold text-white'>₹{props.fare.car}</h2>
            </div>
            
            {/* Pool Bike Option */}
            <div onClick={() => handleVehicleSelect('moto')} className='flex border-2 border-gray-700 hover:border-gray-600 active:border-white mb-3 rounded-xl w-full p-4 items-center justify-between bg-gray-800/50 cursor-pointer'>
                <img className='h-12' src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_638,w_956/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png" alt="" />
                <div className='ml-3 flex-1'>
                    <h4 className='font-medium text-base text-white'>Pool Bike <span className="text-gray-400"><i className="ri-user-3-fill"></i>2</span></h4>
                    <h5 className='font-medium text-sm text-gray-300'>3 mins away</h5>
                    <p className='font-normal text-xs text-gray-400'>Quick campus rides</p>
                </div>
                <h2 className='text-xl font-semibold text-white'>₹{props.fare.moto}</h2>
            </div>
            
            {/* Pool Auto Option */}
            <div onClick={() => handleVehicleSelect('auto')} className='flex border-2 border-gray-700 hover:border-gray-600 active:border-white mb-3 rounded-xl w-full p-4 items-center justify-between bg-gray-800/50 cursor-pointer'>
                <img className='h-12' src="data:image/jpeg;base64,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" alt="" />
                <div className='ml-3 flex-1'>
                    <h4 className='font-medium text-base text-white'>Pool Moped <span className="text-gray-400"><i className="ri-user-3-fill"></i>3</span></h4>
                    <h5 className='font-medium text-sm text-gray-300'>3 mins away</h5>
                    <p className='font-normal text-xs text-gray-400'>Comfortable shared rides</p>
                </div>
                <h2 className='text-xl font-semibold text-white'>₹{props.fare.auto}</h2>
            </div>
        </div>
    )
}

export default VehiclePanel
