import React, { useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import Start from './pages/Start'
import UserLogin from './pages/UserLogin'
import UserSignup from './pages/UserSignup'
import Captainlogin from './pages/Captainlogin'
import CaptainSignup from './pages/CaptainSignup'
import Home from './pages/Home'
import UserProtectWrapper from './pages/UserProtectWrapper'
import UserLogout from './pages/UserLogout'
import CaptainHome from './pages/CaptainHome'
import CaptainProtectWrapper from './pages/CaptainProtectWrapper'
import CaptainLogout from './pages/CaptainLogout'
import Riding from './pages/Riding'
import CaptainRiding from './pages/CaptainRiding'
import 'remixicon/fonts/remixicon.css'

const App = () => {

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Main App Container - Mobile First */}
      <div className="mx-auto max-w-sm bg-black min-h-screen">
        <Routes>
          {/* Student Routes */}
          <Route path='/' element={<Start />} />
          <Route path='/student-login' element={<UserLogin />} />
          <Route path='/student-signup' element={<UserSignup />} />
          <Route path='/login' element={<UserLogin />} />
          <Route path='/signup' element={<UserSignup />} />
          
          {/* Driver Routes */}
          <Route path='/driver-login' element={<Captainlogin />} />
          <Route path='/driver-signup' element={<CaptainSignup />} />
          <Route path='/captain-login' element={<Captainlogin />} />
          <Route path='/captain-signup' element={<CaptainSignup />} />
          
          {/* Main Dashboard Routes */}
          <Route path='/dashboard' element={
            <UserProtectWrapper>
              <Home />
            </UserProtectWrapper>
          } />
          <Route path='/home' element={
            <UserProtectWrapper>
              <Home />
            </UserProtectWrapper>
          } />
          
          {/* Driver Dashboard */}
          <Route path='/driver-dashboard' element={
            <CaptainProtectWrapper>
              <CaptainHome />
            </CaptainProtectWrapper>
          } />
          <Route path='/captain-home' element={
            <CaptainProtectWrapper>
              <CaptainHome />
            </CaptainProtectWrapper>
          } />
          
          {/* Active Ride Routes */}
          <Route path='/pool-ride' element={
            <UserProtectWrapper>
              <Riding />
            </UserProtectWrapper>
          } />
          <Route path='/riding' element={
            <UserProtectWrapper>
              <Riding />
            </UserProtectWrapper>
          } />
          
          <Route path='/driving' element={
            <CaptainProtectWrapper>
              <CaptainRiding />
            </CaptainProtectWrapper>
          } />
          <Route path='/captain-riding' element={
            <CaptainProtectWrapper>
              <CaptainRiding />
            </CaptainProtectWrapper>
          } />
          
          {/* Logout Routes */}
          <Route path='/student/logout' element={
            <UserProtectWrapper>
              <UserLogout />
            </UserProtectWrapper>
          } />
          <Route path='/user/logout' element={
            <UserProtectWrapper>
              <UserLogout />
            </UserProtectWrapper>
          } />
          
          <Route path='/driver/logout' element={
            <CaptainProtectWrapper>
              <CaptainLogout />
            </CaptainProtectWrapper>
          } />
          <Route path='/captain/logout' element={
            <CaptainProtectWrapper>
              <CaptainLogout />
            </CaptainProtectWrapper>
          } />
        </Routes>
      </div>
    </div>
  )
}

export default App
