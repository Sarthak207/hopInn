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
                <img className='h-12' src="https://png.pngtree.com/png-clipart/20190516/original/pngtree-scooter-png-image_3637449.jpg" alt="" />
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
