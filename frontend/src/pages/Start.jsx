import React from 'react'
import { Link } from 'react-router-dom'

const Start = () => {
  return (
    <div>
      <div className='bg-cover bg-center bg-[url(https://images.unsplash.com/photo-1530203283902-296243a9169f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzB8fGJpa2VzfGVufDB8fDB8fHww)] h-screen flex justify-end flex-col w-full relative'>
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        {/* Cool Floating Logo */}
        <div className="absolute top-12 left-8 z-20">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-2xl border border-white/20">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <div>
                <h1 className="text-black text-xl font-bold">hopIn</h1>
                <p className="text-gray-600 text-sm">Student Rides</p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="absolute top-12 right-8 z-20">
          <div className="bg-black/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
            <p className="text-white text-sm font-medium">Safe • Simple</p>
          </div>
        </div>

        {/* Bottom Card - Uber Style */}
        <div className='bg-white pb-8 py-8 px-8 rounded-t-2xl relative z-10'>
          <div className="space-y-6">
            {/* Main Heading */}
            <div className="space-y-3">
              <h2 className='text-3xl font-bold text-gray-900'>Get Started with hopIn</h2>
              <p className="text-gray-600 text-lg">Safe rides for college students</p>
            </div>

            {/* Feature Points */}
            <div className="space-y-4 py-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                <p className="text-gray-700">Split costs with classmates</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                <p className="text-gray-700">Verified student network</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                <p className="text-gray-700">24/7 campus coverage</p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex justify-between py-4 border-t border-gray-200">
              <div className="text-center">
                <p className="text-xl font-bold text-gray-900">500+</p>
                <p className="text-gray-500 text-sm">Students</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-gray-900">₹50</p>
                <p className="text-gray-500 text-sm">Avg. savings</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-gray-900">24/7</p>
                <p className="text-gray-500 text-sm">Available</p>
              </div>
            </div>

            {/* CTA Button - Uber Style */}
            <Link 
              to='/login' 
              className='flex items-center justify-center w-full bg-black text-white py-4 rounded-lg text-lg font-semibold hover:bg-gray-900 transition-colors duration-200'
            >
              Continue
            </Link>

            {/* Secondary Action */}
            <div className="text-center pt-2">
              <Link 
                to='/driver-login' 
                className='text-gray-600 text-sm underline hover:text-gray-900 transition-colors duration-200'
              >
                Drive and earn with hopIn
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Start
