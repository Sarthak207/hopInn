import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPinIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const CampusLocationPicker = ({ onLocationSelect, selectedLocation, placeholder = "Select campus location" }) => {
    const [locations, setLocations] = useState([]);
    const [filteredLocations, setFilteredLocations] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedType, setSelectedType] = useState('all');

    // Location types for filtering
    const locationTypes = [
        { value: 'all', label: 'All Locations' },
        { value: 'hostel', label: 'Hostels' },
        { value: 'gate', label: 'Gates' },
        { value: 'academic', label: 'Academic' },
        { value: 'sports', label: 'Sports' },
        { value: 'dining', label: 'Dining' },
        { value: 'medical', label: 'Medical' },
        { value: 'other', label: 'Other' }
    ];

    // Fetch campus locations
    useEffect(() => {
        fetchCampusLocations();
    }, []);

    const fetchCampusLocations = async () => {
    try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        console.log('🔍 Fetching campus locations...');
        console.log('Token:', token ? 'Present' : 'Missing');
        console.log('Base URL:', import.meta.env.VITE_BASE_URL);
        console.log('Full URL:', `${import.meta.env.VITE_BASE_URL}/campus/locations`);
        
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/campus/locations`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('✅ API Response Status:', response.status);
        console.log('✅ API Response Data:', response.data);
        
        if (response.data.success) {
            setLocations(response.data.locations);
            setFilteredLocations(response.data.locations);
            console.log('✅ Locations loaded:', response.data.locations.length);
        }
    } catch (error) {
        console.error('❌ Fetch Error:', error);
        console.error('Error Message:', error.message);
        console.error('Error Response:', error.response?.data);
        console.error('Error Status:', error.response?.status);
    } finally {
        setLoading(false);
    }
};

    const handleLocationSelect = (location) => {
        onLocationSelect(location);
        setIsDropdownOpen(false);
        setSearchQuery('');
    };

    const getLocationTypeColor = (type) => {
        const colors = {
            gate: 'bg-blue-100 text-blue-800',
            hostel: 'bg-green-100 text-green-800',
            academic: 'bg-purple-100 text-purple-800',
            sports: 'bg-orange-100 text-orange-800',
            dining: 'bg-yellow-100 text-yellow-800',
            medical: 'bg-red-100 text-red-800',
            other: 'bg-gray-100 text-gray-800'
        };
        return colors[type] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="relative">
            {/* Selected Location Display */}
            <div
                className="w-full p-3 border border-gray-300 rounded-lg bg-white cursor-pointer flex items-center justify-between hover:border-gray-400 transition-colors"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
                <div className="flex items-center">
                    <MapPinIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <span className={selectedLocation ? 'text-gray-900' : 'text-gray-500'}>
                        {selectedLocation ? selectedLocation.name : placeholder}
                    </span>
                </div>
                <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            {/* Dropdown */}
            {isDropdownOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-hidden">
                    {/* Search and Filter Header */}
                    <div className="p-3 border-b border-gray-200 bg-gray-50">
                        {/* Search Input */}
                        <div className="relative mb-3">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search locations..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Type Filter */}
                        <select
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                        >
                            {locationTypes.map(type => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Locations List */}
                    <div className="max-h-64 overflow-y-auto">
                        {loading ? (
                            <div className="p-4 text-center text-gray-500">Loading locations...</div>
                        ) : filteredLocations.length > 0 ? (
                            filteredLocations.map((location) => (
                                <div
                                    key={location._id}
                                    className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                    onClick={() => handleLocationSelect(location)}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center mb-1">
                                                <span className="font-medium text-gray-900">{location.name}</span>
                                                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getLocationTypeColor(location.type)}`}>
                                                    {location.type}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-1">{location.description}</p>
                                            {location.aliases.length > 0 && (
                                                <p className="text-xs text-gray-500">
                                                    Also known as: {location.aliases.join(', ')}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-4 text-center text-gray-500">
                                {searchQuery ? 'No locations found matching your search' : 'No locations available'}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CampusLocationPicker;
