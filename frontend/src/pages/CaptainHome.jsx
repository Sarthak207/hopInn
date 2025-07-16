import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import CaptainDetails from '../components/CaptainDetails'
import RidePopUp from '../components/RidePopUp'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ConfirmRidePopUp from '../components/ConfirmRidePopUp'
import { useEffect, useContext } from 'react'
import { SocketContext } from '../context/SocketContext'
import { CaptainDataContext } from '../context/CapatainContext'
import axios from 'axios'

const CaptainHome = () => {

    const [ ridePopupPanel, setRidePopupPanel ] = useState(false)
    const [ confirmRidePopupPanel, setConfirmRidePopupPanel ] = useState(false)

    const ridePopupPanelRef = useRef(null)
    const confirmRidePopupPanelRef = useRef(null)
    const [ ride, setRide ] = useState(null)

    const { socket } = useContext(SocketContext)
    const { captain } = useContext(CaptainDataContext)

    useEffect(() => {
        socket.emit('join', {
            userId: captain._id,
            userType: 'captain'
        })
        
        const updateLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {
                    socket.emit('update-location-captain', {
                        userId: captain._id,
                        location: {
                            ltd: position.coords.latitude,
                            lng: position.coords.longitude
                        }
                    })
                })
            }
        }

        const locationInterval = setInterval(updateLocation, 10000)
        updateLocation()

        return () => clearInterval(locationInterval)
    }, [socket, captain])

    useEffect(() => {
        if (!socket) return

        // Listen for new ride requests
        const handleNewRide = (data) => {
            console.log('New ride request received:', data)
            setRide(data)
            setRidePopupPanel(true)
            // Don't show confirm popup yet - wait for user confirmation
        }

        // Listen for ride confirmation from user/student
        const handleRideConfirmed = (data) => {
            console.log('Ride confirmed by user:', data)
            setRide(data)
            setRidePopupPanel(false) // Hide ride request popup
            setConfirmRidePopupPanel(true) // Now show OTP confirmation popup
        }

        // Listen for ride cancellation
        const handleRideCancelled = () => {
            console.log('Ride cancelled')
            setRidePopupPanel(false)
            setConfirmRidePopupPanel(false)
            setRide(null)
        }

        socket.on('new-ride', handleNewRide)
        socket.on('ride-confirmed', handleRideConfirmed)
        socket.on('ride-cancelled', handleRideCancelled)

        return () => {
            socket.off('new-ride', handleNewRide)
            socket.off('ride-confirmed', handleRideConfirmed)
            socket.off('ride-cancelled', handleRideCancelled)
        }
    }, [socket])

    // Function to accept ride (driver accepts the ride request)
    async function acceptRide() {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/accept`, {
                rideId: ride._id,
                captainId: captain._id,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })

            if (response.status === 200) {
                console.log('Ride accepted by driver')
                // Don't open confirm popup here - wait for user confirmation
                // The confirm popup will open when 'ride-confirmed' event is received
            }
        } catch (error) {
            console.error('Error accepting ride:', error)
        }
    }

    // Function to reject ride
    async function rejectRide() {
        try {
            setRidePopupPanel(false)
            setRide(null)
            // Optionally notify backend about rejection
        } catch (error) {
            console.error('Error rejecting ride:', error)
        }
    }

    useGSAP(function () {
        if (ridePopupPanel) {
            gsap.to(ridePopupPanelRef.current, {
                transform: 'translateY(0)',
                duration: 0.3,
                ease: "power2.out"
            })
        } else {
            gsap.to(ridePopupPanelRef.current, {
                transform: 'translateY(100%)',
                duration: 0.3,
                ease: "power2.in"
            })
        }
    }, [ ridePopupPanel ])

    useGSAP(function () {
        if (confirmRidePopupPanel) {
            gsap.to(confirmRidePopupPanelRef.current, {
                transform: 'translateY(0)',
                duration: 0.3,
                ease: "power2.out"
            })
        } else {
            gsap.to(confirmRidePopupPanelRef.current, {
                transform: 'translateY(100%)',
                duration: 0.3,
                ease: "power2.in"
            })
        }
    }, [ confirmRidePopupPanel ])

    return (
        <div className='h-screen bg-black'>
            {/* Header */}
            <div className='fixed p-6 top-0 flex items-center justify-between w-screen z-20'>
                {/* hopIn Logo */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-white text-lg font-bold">hopIn</h1>
                            <p className="text-gray-300 text-xs">Driver Dashboard</p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-3">
                    {/* Online Status */}
                    <div className="bg-green-600/20 border border-green-600/30 rounded-full px-3 py-1">
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-green-400 text-sm font-medium">Online</span>
                        </div>
                    </div>
                    
                    {/* Logout Button */}
                    <Link to='/captain/logout' className='h-10 w-10 bg-white/10 backdrop-blur-sm flex items-center justify-center rounded-full border border-white/20'>
                        <i className="text-lg font-medium ri-logout-box-r-line text-white"></i>
                    </Link>
                </div>
            </div>

            {/* Map Area */}
            <div className='relative h-3/5 bg-gray-900'>
                <img className='h-full w-full object-cover' src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif" alt="" />
                
                {/* Map Overlay */}
                <div className="absolute inset-0 bg-black/20"></div>
                
                {/* Status Cards */}
                <div className="absolute top-24 left-4 right-4 space-y-2">
                    <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-3 border border-gray-700">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <i className="ri-map-pin-line text-blue-400"></i>
                                <span className="text-white text-sm">Location Updated</span>
                            </div>
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                        </div>
                    </div>
                </div>

                {/* Floating Stats */}
                <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <p className="text-2xl font-bold text-white">12</p>
                                <p className="text-xs text-gray-400">Rides Today</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-green-400">₹560</p>
                                <p className="text-xs text-gray-400">Today's Earnings</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-blue-400">4.8</p>
                                <p className="text-xs text-gray-400">Rating</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className='h-2/5 p-6 bg-gray-900'>
                <CaptainDetails />
            </div>

            {/* Ride Request Popup Panel - Shows when new ride comes in */}
            <div ref={ridePopupPanelRef} className='fixed w-full max-w-sm mx-auto left-0 right-0 z-30 bottom-0 translate-y-full'>
                <div className='bg-gray-900 rounded-t-2xl border-t border-gray-700 px-6 py-10'>
                    <RidePopUp
                        ride={ride}
                        setRidePopupPanel={setRidePopupPanel}
                        setConfirmRidePopupPanel={setConfirmRidePopupPanel}
                        acceptRide={acceptRide}
                        rejectRide={rejectRide}
                    />
                </div>
            </div>

            {/* Confirm Ride Popup Panel - Shows ONLY after user confirms */}
            <div ref={confirmRidePopupPanelRef} className='fixed w-full max-w-sm mx-auto left-0 right-0 z-30 bottom-0 translate-y-full'>
                <div className='bg-gray-900 rounded-t-2xl border-t border-gray-700 px-6 py-10 h-screen overflow-y-auto'>
                    <ConfirmRidePopUp
                        ride={ride}
                        setConfirmRidePopupPanel={setConfirmRidePopupPanel} 
                        setRidePopupPanel={setRidePopupPanel} 
                    />
                </div>
            </div>
        </div>
    )
}

export default CaptainHome
