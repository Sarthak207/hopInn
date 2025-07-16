import React, { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import axios from 'axios';
import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from '../components/LocationSearchPanel';
import VehiclePanel from '../components/VehiclePanel';
import ConfirmRide from '../components/ConfirmRide';
import LookingForDriver from '../components/LookingForDriver';
import WaitingForDriver from '../components/WaitingForDriver';
import { SocketContext } from '../context/SocketContext';
import { useContext } from 'react';
import { UserDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import LiveTracking from '../components/LiveTracking';

const Home = () => {
    const [ pickup, setPickup ] = useState('')
    const [ destination, setDestination ] = useState('')
    const [ panelOpen, setPanelOpen ] = useState(false)
    const vehiclePanelRef = useRef(null)
    const confirmRidePanelRef = useRef(null)
    const vehicleFoundRef = useRef(null)
    const waitingForDriverRef = useRef(null)
    const panelRef = useRef(null)
    const panelCloseRef = useRef(null)
    const [ vehiclePanel, setVehiclePanel ] = useState(false)
    const [ confirmRidePanel, setConfirmRidePanel ] = useState(false)
    const [ vehicleFound, setVehicleFound ] = useState(false)
    const [ waitingForDriver, setWaitingForDriver ] = useState(false)
    const [ pickupSuggestions, setPickupSuggestions ] = useState([])
    const [ destinationSuggestions, setDestinationSuggestions ] = useState([])
    const [ activeField, setActiveField ] = useState(null)
    const [ fare, setFare ] = useState({})
    const [ vehicleType, setVehicleType ] = useState(null)
    const [ ride, setRide ] = useState(null)

    const navigate = useNavigate()
    const { socket } = useContext(SocketContext)
    const { user } = useContext(UserDataContext)

    useEffect(() => {
        setVehiclePanel(false)
        setConfirmRidePanel(false)
        setVehicleFound(false)
        setWaitingForDriver(false)
        setPanelOpen(false)
        
        if (socket && user) {
            socket.emit("join", { userType: "user", userId: user._id })
        }
    }, [ user, socket ])

    useEffect(() => {
        if (!socket) return;

        const handleRideConfirmed = (ride) => {
            setVehicleFound(false)
            setWaitingForDriver(true)
            setRide(ride)
        }

        const handleRideStarted = (ride) => {
            setWaitingForDriver(false)
            navigate('/riding', { state: { ride } })
        }

        socket.on('ride-confirmed', handleRideConfirmed)
        socket.on('ride-started', handleRideStarted)

        return () => {
            socket.off('ride-confirmed', handleRideConfirmed)
            socket.off('ride-started', handleRideStarted)
        }
    }, [socket, navigate])

    const handlePickupChange = async (e) => {
        setPickup(e.target.value)
        
        if (e.target.value.length < 2) {
            setPickupSuggestions([]);
            return;
        }
        
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
                params: { input: e.target.value }
                // No auth header temporarily
            })
            
            if (response.data.success) {
                setPickupSuggestions(response.data.data || []);
            } else {
                setPickupSuggestions([]);
            }
        } catch (error) {
            console.error('Pickup request failed:', error.message);
            setPickupSuggestions([]);
        }
    }

    const handleDestinationChange = async (e) => {
        setDestination(e.target.value)
        
        if (e.target.value.length < 2) {
            setDestinationSuggestions([]);
            return;
        }
        
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
                params: { input: e.target.value }
                // No auth header temporarily
            })
            
            if (response.data.success) {
                setDestinationSuggestions(response.data.data || []);
            } else {
                setDestinationSuggestions([]);
            }
        } catch (error) {
            console.error('Destination request failed:', error.message);
            setDestinationSuggestions([]);
        }
    }

    const submitHandler = (e) => {
        e.preventDefault()
    }

    useGSAP(function () {
        if (panelOpen) {
            gsap.to(panelRef.current, {
                height: 'calc(50vh - 60px)',
                padding: 24,
                duration: 0.3,
                ease: "power2.out"
            })
            gsap.to(panelCloseRef.current, {
                opacity: 1,
                duration: 0.3
            })
        } else {
            gsap.to(panelRef.current, {
                height: '0px',
                padding: 0,
                duration: 0.3,
                ease: "power2.in"
            })
            gsap.to(panelCloseRef.current, {
                opacity: 0,
                duration: 0.3
            })
        }
    }, [ panelOpen ])

    useGSAP(function () {
        if (vehiclePanel) {
            gsap.to(vehiclePanelRef.current, {
                transform: 'translateY(0)',
                duration: 0.3,
                ease: "power2.out"
            })
        } else {
            gsap.to(vehiclePanelRef.current, {
                transform: 'translateY(100%)',
                duration: 0.3,
                ease: "power2.in"
            })
        }
    }, [ vehiclePanel ])

    useGSAP(function () {
        if (confirmRidePanel) {
            gsap.to(confirmRidePanelRef.current, {
                transform: 'translateY(0)',
                duration: 0.3,
                ease: "power2.out"
            })
        } else {
            gsap.to(confirmRidePanelRef.current, {
                transform: 'translateY(100%)',
                duration: 0.3,
                ease: "power2.in"
            })
        }
    }, [ confirmRidePanel ])

    useGSAP(function () {
        if (vehicleFound) {
            gsap.to(vehicleFoundRef.current, {
                transform: 'translateY(0)',
                duration: 0.3,
                ease: "power2.out"
            })
        } else {
            gsap.to(vehicleFoundRef.current, {
                transform: 'translateY(100%)',
                duration: 0.3,
                ease: "power2.in"
            })
        }
    }, [ vehicleFound ])

    useGSAP(function () {
        if (waitingForDriver) {
            gsap.to(waitingForDriverRef.current, {
                transform: 'translateY(0)',
                duration: 0.3,
                ease: "power2.out"
            })
        } else {
            gsap.to(waitingForDriverRef.current, {
                transform: 'translateY(100%)',
                duration: 0.3,
                ease: "power2.in"
            })
        }
    }, [ waitingForDriver ])

    async function findTrip() {
        if (!pickup || !destination) {
            alert('Please select both pickup and destination locations')
            return
        }

        try {
            setPanelOpen(false)
            
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-fare`, {
                params: { pickup, destination },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            setFare(response.data)

            setTimeout(() => {
                setVehiclePanel(true)
            }, 400)

        } catch (error) {
            console.error('Error fetching fare:', error)
            
            // Mock fare data for testing
            const mockFare = {
                car: 50,
                moto: 30,
                auto: 40
            }
            setFare(mockFare)
            
            setTimeout(() => {
                setVehiclePanel(true)
            }, 400)
        }
    }

    async function createRide() {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/create`, {
                pickup,
                destination,
                vehicleType
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            console.log('Ride created:', response.data)
        } catch (error) {
            console.error('Error creating ride:', error)
        }
    }

    return (
        <div className='h-screen relative overflow-hidden bg-black'>
            {/* Header with hopIn Logo */}
            <div className="absolute top-6 left-6 z-30">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-white text-lg font-bold">hopIn</h1>
                            <p className="text-gray-300 text-xs">Find a ride</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile Button */}
            <div className="absolute top-6 right-6 z-30">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                </div>
            </div>

            {/* Live Tracking Map */}
            <div className='h-screen w-screen'>
                <LiveTracking />
            </div>

            {/* Main Bottom Panel */}
            {!vehiclePanel && !confirmRidePanel && !vehicleFound && !waitingForDriver && (
                <div className="fixed bottom-0 left-0 right-0 w-full max-w-sm mx-auto z-20">
                    <div className='bg-gray-900 rounded-t-2xl border-t border-gray-700 p-6'>
                        <h5 ref={panelCloseRef} onClick={() => {
                            setPanelOpen(false)
                        }} className='absolute opacity-0 right-6 top-6 text-2xl text-white cursor-pointer'>
                            <i className="ri-arrow-down-wide-line"></i>
                        </h5>
                        <h4 className='text-2xl font-semibold text-white mb-4'>Find a Pool</h4>
                        <form className='relative py-3' onSubmit={submitHandler}>
                            <div className="line absolute h-16 w-1 top-[50%] -translate-y-1/2 left-5 bg-gray-600 rounded-full"></div>
                            <input
                                onClick={() => {
                                    setPanelOpen(true)
                                    setActiveField('pickup')
                                }}
                                value={pickup}
                                onChange={handlePickupChange}
                                className='bg-gray-800 border border-gray-700 text-white px-12 py-3 text-lg rounded-lg w-full placeholder:text-gray-400 focus:outline-none focus:border-gray-600'
                                type="text"
                                placeholder='Campus pickup location'
                            />
                            <input
                                onClick={() => {
                                    setPanelOpen(true)
                                    setActiveField('destination')
                                }}
                                value={destination}
                                onChange={handleDestinationChange}
                                className='bg-gray-800 border border-gray-700 text-white px-12 py-3 text-lg rounded-lg w-full mt-3 placeholder:text-gray-400 focus:outline-none focus:border-gray-600'
                                type="text"
                                placeholder='Where to?'
                            />
                        </form>
                        <button
                            onClick={findTrip}
                            disabled={!pickup || !destination}
                            className='bg-white text-black px-4 py-3 rounded-lg mt-4 w-full font-semibold hover:bg-gray-200 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed'>
                            Find Pool Ride
                        </button>
                    </div>

                    <div ref={panelRef} className='bg-gray-900 border-t border-gray-700 overflow-y-auto' style={{ height: '0px', maxHeight: '50vh' }}>
                        <LocationSearchPanel
                            suggestions={activeField === 'pickup' ? pickupSuggestions : destinationSuggestions}
                            setPanelOpen={setPanelOpen}
                            setVehiclePanel={setVehiclePanel}
                            setPickup={setPickup}
                            setDestination={setDestination}
                            activeField={activeField}
                        />
                    </div>
                </div>
            )}

            {/* Vehicle Panel */}
            <div ref={vehiclePanelRef} className='fixed w-full max-w-sm mx-auto left-0 right-0 z-25 bottom-0 translate-y-full'>
                <div className='bg-gray-900 rounded-t-2xl border-t border-gray-700 max-h-[80vh] overflow-y-auto'>
                    <div className='px-6 py-8'>
                        <VehiclePanel
                            selectVehicle={setVehicleType}
                            fare={fare} 
                            setConfirmRidePanel={setConfirmRidePanel} 
                            setVehiclePanel={setVehiclePanel} />
                    </div>
                </div>
            </div>

            {/* Confirm Ride Panel */}
            <div ref={confirmRidePanelRef} className='fixed w-full max-w-sm mx-auto left-0 right-0 z-25 bottom-0 translate-y-full'>
                <div className='bg-gray-900 rounded-t-2xl border-t border-gray-700 max-h-[80vh] overflow-y-auto'>
                    <div className='px-6 py-8'>
                        <ConfirmRide
                            createRide={createRide}
                            pickup={pickup}
                            destination={destination}
                            fare={fare}
                            vehicleType={vehicleType}
                            setConfirmRidePanel={setConfirmRidePanel} 
                            setVehicleFound={setVehicleFound} />
                    </div>
                </div>
            </div>

            {/* Vehicle Found Panel */}
            <div ref={vehicleFoundRef} className='fixed w-full max-w-sm mx-auto left-0 right-0 z-25 bottom-0 translate-y-full'>
                <div className='bg-gray-900 rounded-t-2xl border-t border-gray-700 max-h-[80vh] overflow-y-auto'>
                    <div className='px-6 py-8'>
                        <LookingForDriver
                            createRide={createRide}
                            pickup={pickup}
                            destination={destination}
                            fare={fare}
                            vehicleType={vehicleType}
                            setVehicleFound={setVehicleFound} />
                    </div>
                </div>
            </div>

            {/* Waiting for Driver Panel */}
            <div ref={waitingForDriverRef} className='fixed w-full max-w-sm mx-auto left-0 right-0 z-25 bottom-0 translate-y-full'>
                <div className='bg-gray-900 rounded-t-2xl border-t border-gray-700 max-h-[80vh] overflow-y-auto'>
                    <div className='px-6 py-8'>
                        <WaitingForDriver
                            ride={ride}
                            setVehicleFound={setVehicleFound}
                            setWaitingForDriver={setWaitingForDriver}
                            waitingForDriver={waitingForDriver} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home
