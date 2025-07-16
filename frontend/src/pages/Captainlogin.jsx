import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { CaptainDataContext } from '../context/CapatainContext'

const Captainlogin = () => {

  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')

  const { captain, setCaptain } = React.useContext(CaptainDataContext)
  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault();
    const captain = {
      email: email,
      password
    }

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/login`, captain)

    if (response.status === 200) {
      const data = response.data

      setCaptain(data.captain)
      localStorage.setItem('token', data.token)
      navigate('/captain-home')

    }

    setEmail('')
    setPassword('')
  }

  return (
    <div className='bg-black text-white h-screen flex flex-col justify-between'>
      {/* Header with Back Button */}
      <div className="px-8 py-6 flex items-center justify-between">
        <Link to='/' className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className="text-right">
          <p className="text-sm text-gray-400">Driver Portal</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-8 py-6">
        {/* hopIn Logo for Drivers */}
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">hopIn</h1>
              <p className="text-sm text-gray-400">Driver Login</p>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={(e) => {
          submitHandler(e)
        }} className="space-y-6">
          
          <div className="space-y-2">
            <h3 className='text-lg font-medium text-gray-300'>Email</h3>
            <input
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
              }}
              className='bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 w-full text-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-gray-600 focus:bg-gray-750'
              type="email"
              placeholder='driver@college.edu'
            />
          </div>

          <div className="space-y-2">
            <h3 className='text-lg font-medium text-gray-300'>Password</h3>
            <input
              className='bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 w-full text-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-gray-600 focus:bg-gray-750'
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
              }}
              required 
              type="password"
              placeholder='Enter your password'
            />
          </div>

          <button
            className='bg-white text-black font-semibold rounded-lg px-4 py-3 w-full text-lg hover:bg-gray-200 transition-colors duration-200 mt-8'
          >
            Sign In as Driver
          </button>

        </form>

        {/* Driver Benefits */}
        <div className="bg-gray-800/50 rounded-lg p-4 mt-8">
          <h4 className="text-white font-medium mb-2">Drive with hopIn</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <i className="ri-money-dollar-circle-line text-green-400"></i>
              <span className="text-gray-300 text-sm">Earn extra income</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="ri-calendar-line text-blue-400"></i>
              <span className="text-gray-300 text-sm">Flexible schedule</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="ri-group-line text-purple-400"></i>
              <span className="text-gray-300 text-sm">Help fellow students</span>
            </div>
          </div>
        </div>

        {/* Sign Up Link */}
        <div className="text-center mt-6">
          <p className='text-gray-400'>
            New driver? 
            <Link to='/captain-signup' className='text-white underline ml-1 hover:text-gray-300 transition-colors duration-200'>
              Join hopIn
            </Link>
          </p>
        </div>
      </div>

      {/* Bottom Student Link */}
      <div className="px-8 py-6">
        <div className="border-t border-gray-800 pt-6">
          <Link
            to='/login'
            className='bg-gray-800 flex items-center justify-center text-white font-semibold rounded-lg px-4 py-3 w-full text-lg hover:bg-gray-700 transition-colors duration-200'
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            Sign in as Student
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Captainlogin
