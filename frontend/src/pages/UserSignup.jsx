import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserDataContext } from '../context/UserContext'

const UserSignup = () => {
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ firstName, setFirstName ] = useState('')
  const [ lastName, setLastName ] = useState('')
  const [ userData, setUserData ] = useState({})

  const navigate = useNavigate()

  const { user, setUser } = useContext(UserDataContext)

  const submitHandler = async (e) => {
    e.preventDefault()
    const newUser = {
      fullname: {
        firstname: firstName,
        lastname: lastName
      },
      email: email,
      password: password
    }

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, newUser)

    if (response.status === 201) {
      const data = response.data
      setUser(data.user)
      localStorage.setItem('token', data.token)
      navigate('/home')
    }

    setEmail('')
    setFirstName('')
    setLastName('')
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
          <p className="text-sm text-gray-400">Join hopIn</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-8 py-6">
        {/* hopIn Logo */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">hopIn</h1>
              <p className="text-sm text-gray-400">Student Signup</p>
            </div>
          </div>
        </div>

        {/* Signup Form */}
        <form onSubmit={(e) => {
          submitHandler(e)
        }} className="space-y-6">
          
          {/* Name Fields */}
          <div className="space-y-2">
            <h3 className='text-lg font-medium text-gray-300'>Full Name</h3>
            <div className='flex gap-4'>
              <input
                required
                className='bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 w-1/2 text-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-gray-600 focus:bg-gray-750'
                type="text"
                placeholder='First name'
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value)
                }}
              />
              <input
                required
                className='bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 w-1/2 text-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-gray-600 focus:bg-gray-750'
                type="text"
                placeholder='Last name'
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value)
                }}
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <h3 className='text-lg font-medium text-gray-300'>College Email</h3>
            <input
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
              }}
              className='bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 w-full text-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-gray-600 focus:bg-gray-750'
              type="email"
              placeholder='your@college.edu'
            />
          </div>

          {/* Password Field */}
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
              placeholder='Create a secure password'
            />
          </div>

          <button
            className='bg-white text-black font-semibold rounded-lg px-4 py-3 w-full text-lg hover:bg-gray-200 transition-colors duration-200 mt-8'
          >
            Create Account
          </button>

        </form>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className='text-gray-400'>
            Already have an account? 
            <Link to='/login' className='text-white underline ml-1 hover:text-gray-300 transition-colors duration-200'>
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* Bottom Privacy Policy */}
      <div className="px-8 py-6">
        <div className="border-t border-gray-800 pt-6">
          <p className='text-xs text-gray-500 leading-relaxed text-center'>
            By creating an account, you agree to hopIn's{' '}
            <span className='underline text-gray-400'>Terms of Service</span> and{' '}
            <span className='underline text-gray-400'>Privacy Policy</span>.
            <br />
            Safe rides for verified college students.
          </p>
        </div>
      </div>
    </div>
  )
}

export default UserSignup
