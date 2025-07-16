import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { CaptainDataContext } from '../context/CapatainContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const CaptainSignup = () => {

  const navigate = useNavigate()

  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ firstName, setFirstName ] = useState('')
  const [ lastName, setLastName ] = useState('')

  const [ vehicleColor, setVehicleColor ] = useState('')
  const [ vehiclePlate, setVehiclePlate ] = useState('')
  const [ vehicleCapacity, setVehicleCapacity ] = useState('')
  const [ vehicleType, setVehicleType ] = useState('')

  const { captain, setCaptain } = React.useContext(CaptainDataContext)

  const submitHandler = async (e) => {
    e.preventDefault()
    const captainData = {
      fullname: {
        firstname: firstName,
        lastname: lastName
      },
      email: email,
      password: password,
      vehicle: {
        color: vehicleColor,
        plate: vehiclePlate,
        capacity: vehicleCapacity,
        vehicleType: vehicleType
      }
    }

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/register`, captainData)

    if (response.status === 201) {
      const data = response.data
      setCaptain(data.captain)
      localStorage.setItem('token', data.token)
      navigate('/captain-home')
    }

    setEmail('')
    setFirstName('')
    setLastName('')
    setPassword('')
    setVehicleColor('')
    setVehiclePlate('')
    setVehicleCapacity('')
    setVehicleType('')
  }

  return (
    <div className='bg-black text-white h-screen flex flex-col justify-between'>
      {/* Header with Back Button */}
      <div className="px-8 py-6 flex items-center justify-between">
        <Link to='/captain-login' className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className="text-right">
          <p className="text-sm text-gray-400">Start Driving</p>
        </div>
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 px-8 py-6 overflow-y-auto">
        {/* hopIn Logo for Drivers */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">hopIn</h1>
              <p className="text-sm text-gray-400">Driver Registration</p>
            </div>
          </div>
        </div>

        {/* Signup Form */}
        <form onSubmit={(e) => {
          submitHandler(e)
        }} className="space-y-6">
          
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className='text-xl font-semibold text-white mb-4'>Personal Information</h3>
            
            <div className="space-y-2">
              <h4 className='text-lg font-medium text-gray-300'>Full Name</h4>
              <div className='flex gap-4'>
                <input
                  required
                  className='bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 w-1/2 text-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-gray-600'
                  type="text"
                  placeholder='First name'
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value)
                  }}
                />
                <input
                  required
                  className='bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 w-1/2 text-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-gray-600'
                  type="text"
                  placeholder='Last name'
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value)
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className='text-lg font-medium text-gray-300'>Email</h4>
              <input
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                }}
                className='bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 w-full text-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-gray-600'
                type="email"
                placeholder='driver@college.edu'
              />
            </div>

            <div className="space-y-2">
              <h4 className='text-lg font-medium text-gray-300'>Password</h4>
              <input
                className='bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 w-full text-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-gray-600'
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                }}
                required 
                type="password"
                placeholder='Create a secure password'
              />
            </div>
          </div>

          {/* Vehicle Information */}
          <div className="space-y-4 pt-4 border-t border-gray-700">
            <h3 className='text-xl font-semibold text-white mb-4'>Vehicle Information</h3>
            
            <div className='flex gap-4'>
              <div className="space-y-2 flex-1">
                <h4 className='text-sm font-medium text-gray-400'>Vehicle Color</h4>
                <input
                  required
                  className='bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 w-full text-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-gray-600'
                  type="text"
                  placeholder='e.g., Red'
                  value={vehicleColor}
                  onChange={(e) => {
                    setVehicleColor(e.target.value)
                  }}
                />
              </div>
              <div className="space-y-2 flex-1">
                <h4 className='text-sm font-medium text-gray-400'>License Plate</h4>
                <input
                  required
                  className='bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 w-full text-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-gray-600'
                  type="text"
                  placeholder='e.g., ABC123'
                  value={vehiclePlate}
                  onChange={(e) => {
                    setVehiclePlate(e.target.value)
                  }}
                />
              </div>
            </div>
            
            <div className='flex gap-4'>
              <div className="space-y-2 flex-1">
                <h4 className='text-sm font-medium text-gray-400'>Passenger Capacity</h4>
                <input
                  required
                  className='bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 w-full text-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-gray-600'
                  type="number"
                  placeholder='e.g., 4'
                  min="1"
                  max="8"
                  value={vehicleCapacity}
                  onChange={(e) => {
                    setVehicleCapacity(e.target.value)
                  }}
                />
              </div>
              <div className="space-y-2 flex-1">
                <h4 className='text-sm font-medium text-gray-400'>Vehicle Type</h4>
                <select
                  required
                  className='bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 w-full text-lg text-white focus:outline-none focus:border-gray-600'
                  value={vehicleType}
                  onChange={(e) => {
                    setVehicleType(e.target.value)
                  }}
                >
                  <option value="" disabled>Select type</option>
                  <option value="car">Car</option>
                  <option value="auto">Auto</option>
                  <option value="moto">Motorcycle</option>
                </select>
              </div>
            </div>
          </div>

          {/* Driver Benefits */}
          <div className="bg-gray-800/50 rounded-lg p-4 mt-6">
            <h4 className="text-white font-medium mb-3">Why drive with hopIn?</h4>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center gap-2">
                <i className="ri-money-dollar-circle-line text-green-400"></i>
                <span className="text-gray-300 text-sm">Flexible earnings on your schedule</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="ri-group-line text-blue-400"></i>
                <span className="text-gray-300 text-sm">Help fellow students get around campus</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="ri-shield-check-line text-purple-400"></i>
                <span className="text-gray-300 text-sm">Safe, verified student network</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            className='bg-white text-black font-semibold rounded-lg px-4 py-4 w-full text-lg hover:bg-gray-200 transition-colors duration-200 mt-8'
          >
            Start Driving with hopIn
          </button>

        </form>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className='text-gray-400'>
            Already driving with us? 
            <Link to='/captain-login' className='text-white underline ml-1 hover:text-gray-300 transition-colors duration-200'>
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* Bottom Privacy Policy */}
      <div className="px-8 py-6">
        <div className="border-t border-gray-800 pt-4">
          <p className='text-xs text-gray-500 leading-relaxed text-center'>
            By creating an account, you agree to hopIn's{' '}
            <span className='underline text-gray-400'>Driver Terms</span> and{' '}
            <span className='underline text-gray-400'>Privacy Policy</span>.
            <br />
            Safe campus rides by verified student drivers.
          </p>
        </div>
      </div>
    </div>
  )
}

export default CaptainSignup
