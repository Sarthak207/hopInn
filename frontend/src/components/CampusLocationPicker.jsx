import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CampusLocationPicker = ({ onLocationSelect, selectedLocation, placeholder = "Select campus location" }) => {
    const [locations, setLocations] = useState([]);
    const [filteredLocations, setFilteredLocations] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedType, setSelectedType] = useState('all');

    // Location types for filtering
    const locationTypes = [
        { value: 'all', label: 'All Locations', icon: '🏢', color: 'bg-gray-100 text-gray-800' },
        { value: 'hostel', label: 'Hostels', icon: '🏠', color: 'bg-green-100 text-green-800' },
        { value: 'gate', label: 'Gates', icon: '🚪', color: 'bg-blue-100 text-blue-800' },
        { value: 'academic', label: 'Academic', icon: '📚', color: 'bg-purple-100 text-purple-800' },
        { value: 'sports', label: 'Sports', icon: '⚽', color: 'bg-orange-100 text-orange-800' },
        { value: 'dining', label: 'Dining', icon: '🍽️', color: 'bg-yellow-100 text-yellow-800' },
        { value: 'medical', label: 'Medical', icon: '🏥', color: 'bg-red-100 text-red-800' },
        { value: 'other', label: 'Other', icon: '📍', color: 'bg-gray-100 text-gray-800' }
    ];

    useEffect(() => {
        fetchCampusLocations();
    }, []);

    const fetchCampusLocations = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/campus/locations`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (response.data.success) {
                setLocations(response.data.locations);
                setFilteredLocations(response.data.locations);
            }
        } catch (error) {
            console.error('Error fetching campus locations:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let filtered = locations;

        if (selectedType !== 'all') {
            filtered = filtered.filter(location => location.type === selectedType);
        }

        if (searchQuery) {
            filtered = filtered.filter(location =>
                location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                location.aliases.some(alias => alias.toLowerCase().includes(searchQuery.toLowerCase())) ||
                location.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredLocations(filtered);
    }, [searchQuery, selectedType, locations]);

    const handleLocationSelect = (location) => {
        onLocationSelect(location);
        setIsDropdownOpen(false);
        setSearchQuery('');
    };

    const getLocationTypeInfo = (type) => {
        return locationTypes.find(t => t.value === type) || locationTypes[0];
    };

    const clearSelection = () => {
        onLocationSelect(null);
        setSearchQuery('');
    };

    return (
        <div className="relative w-full">
            {/* Main Selection Button */}
            <div
                className={`w-full p-4 border-2 rounded-xl bg-white cursor-pointer flex items-center justify-between transition-all duration-200 hover:border-blue-300 hover:shadow-md ${
                    isDropdownOpen ? 'border-blue-500 shadow-lg' : 'border-gray-200'
                }`}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
                <div className="flex items-center space-x-3">
                    {selectedLocation ? (
                        <>
                            <div className="flex items-center space-x-2">
                                <span className="text-lg">{getLocationTypeInfo(selectedLocation.type).icon}</span>
                                <div>
                                    <span className="font-medium text-gray-900">{selectedLocation.name}</span>
                                    <p className="text-sm text-gray-500">{selectedLocation.description}</p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <span className="text-gray-500 font-medium">{placeholder}</span>
                        </>
                    )}
                </div>
                
                <div className="flex items-center space-x-2">
                    {selectedLocation && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                clearSelection();
                            }}
                            className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                        >
                            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                    <svg
                        className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl max-h-96 overflow-hidden">
                    {/* Search and Filter Header */}
                    <div className="p-4 border-b border-gray-100 bg-gray-50">
                        {/* Search Input */}
                        <div className="relative mb-3">
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Search locations..."
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Type Filter Pills */}
                        <div className="flex flex-wrap gap-2">
                            {locationTypes.map(type => (
                                <button
                                    key={type.value}
                                    onClick={() => setSelectedType(type.value)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center space-x-1 ${
                                        selectedType === type.value
                                            ? 'bg-blue-500 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    <span>{type.icon}</span>
                                    <span>{type.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Locations List */}
                    <div className="max-h-64 overflow-y-auto">
                        {loading ? (
                            <div className="p-6 text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                                <p className="mt-2 text-gray-500">Loading locations...</p>
                            </div>
                        ) : filteredLocations.length > 0 ? (
                            <div className="divide-y divide-gray-100">
                                {filteredLocations.map((location, index) => {
                                    const typeInfo = getLocationTypeInfo(location.type);
                                    return (
                                        <div
                                            key={location._id}
                                            className={`p-4 hover:bg-blue-50 cursor-pointer transition-colors duration-200 ${
                                                index === 0 ? 'rounded-t-lg' : ''
                                            }`}
                                            onClick={() => handleLocationSelect(location)}
                                        >
                                            <div className="flex items-start space-x-3">
                                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                                    <span className="text-lg">{typeInfo.icon}</span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <h3 className="font-medium text-gray-900 truncate">{location.name}</h3>
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeInfo.color}`}>
                                                            {location.type}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mb-2">{location.description}</p>
                                                    {location.aliases && location.aliases.length > 0 && (
                                                        <p className="text-xs text-gray-500">
                                                            <span className="font-medium">Also known as:</span> {location.aliases.join(', ')}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="p-6 text-center">
                                <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <p className="text-gray-500">
                                    {searchQuery ? 'No locations found matching your search' : 'No locations available'}
                                </p>
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="mt-2 text-blue-500 hover:text-blue-600 text-sm font-medium"
                                    >
                                        Clear search
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CampusLocationPicker;
