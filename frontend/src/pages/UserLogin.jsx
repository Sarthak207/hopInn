import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const UserLogin = () => {
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ userData, setUserData ] = useState({})

  const { user, setUser } = useContext(UserDataContext)
  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault();

    const userData = {
      email: email,
      password: password
    }

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, userData)

    if (response.status === 200) {
      const data = response.data
      setUser(data.user)
      localStorage.setItem('token', data.token)
      navigate('/home')
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
          <p className="text-sm text-gray-400">Welcome back</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-8 py-6">
        {/* hopIn Logo */}
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">hopIn</h1>
              <p className="text-sm text-gray-400">Student Login</p>
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
              placeholder='your@college.edu'
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
            Sign In
          </button>

        </form>

        {/* Sign Up Link */}
        <div className="text-center mt-6">
          <p className='text-gray-400'>
            New to hopIn? 
            <Link to='/signup' className='text-white underline ml-1 hover:text-gray-300 transition-colors duration-200'>
              Create Account
            </Link>
          </p>
        </div>
      </div>

      {/* Bottom Driver Link */}
      <div className="px-8 py-6">
        <div className="border-t border-gray-800 pt-6">
          <Link
            to='/driver-login'
            className='bg-gray-800 flex items-center justify-center text-white font-semibold rounded-lg px-4 py-3 w-full text-lg hover:bg-gray-700 transition-colors duration-200'
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
            </svg>
            Drive with hopIn
          </Link>
        </div>
      </div>
    </div>
  )
}

export default UserLogin
