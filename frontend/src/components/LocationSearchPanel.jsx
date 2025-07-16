import React from 'react'

const LocationSearchPanel = ({ suggestions, setVehiclePanel, setPanelOpen, setPickup, setDestination, activeField }) => {

    const handleSuggestionClick = (suggestion) => {
        if (activeField === 'pickup') {
            setPickup(suggestion)
        } else if (activeField === 'destination') {
            setDestination(suggestion)
        }
        setPanelOpen(false)
    }

    return (
        <div className="px-4 py-2">
            {/* Header */}
            <div className="mb-4 pt-2">
                <h5 className="text-gray-300 text-sm font-medium">
                    {activeField === 'pickup' ? 'Select pickup location' : 'Select destination'}
                </h5>
            </div>

            {/* Display fetched suggestions */}
            {suggestions && suggestions.length > 0 ? (
                <div className="space-y-3">
                    {suggestions.map((elem, idx) => (
                        <div 
                            key={idx} 
                            onClick={() => handleSuggestionClick(elem)} 
                            className='flex gap-4 border border-gray-700 p-4 bg-gray-800/50 hover:bg-gray-800 active:border-gray-600 rounded-xl items-center cursor-pointer transition-all duration-200'
                        >
                            <div className='bg-gray-700 h-10 w-10 flex items-center justify-center rounded-full'>
                                <i className="ri-map-pin-fill text-gray-300"></i>
                            </div>
                            <div className="flex-1">
                                <h4 className='font-medium text-white text-base leading-tight'>{elem}</h4>
                                <p className="text-gray-400 text-xs mt-1">Campus location</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                        <i className="ri-search-line text-gray-400 text-xl"></i>
                    </div>
                    <p className="text-gray-400 text-sm">Start typing to see suggestions</p>
                </div>
            )}

            {/* Quick Access Locations */}
            <div className="mt-6 pt-4 border-t border-gray-700">
                <h6 className="text-gray-400 text-xs font-medium mb-3 uppercase tracking-wide">Campus Locations</h6>
                <div className="space-y-2">
                    <div 
                        onClick={() => handleSuggestionClick('Main Library')}
                        className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded-lg cursor-pointer transition-colors duration-200"
                    >
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <i className="ri-book-line text-white text-sm"></i>
                        </div>
                        <span className="text-gray-300 text-sm">Main Library</span>
                    </div>
                    <div 
                        onClick={() => handleSuggestionClick('Student Center')}
                        className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded-lg cursor-pointer transition-colors duration-200"
                    >
                        <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                            <i className="ri-community-line text-white text-sm"></i>
                        </div>
                        <span className="text-gray-300 text-sm">Student Center</span>
                    </div>
                    <div 
                        onClick={() => handleSuggestionClick('Main Gate')}
                        className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded-lg cursor-pointer transition-colors duration-200"
                    >
                        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                            <i className="ri-door-line text-white text-sm"></i>
                        </div>
                        <span className="text-gray-300 text-sm">Main Gate</span>
                    </div>
                    <div 
                        onClick={() => handleSuggestionClick('Parking Area')}
                        className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded-lg cursor-pointer transition-colors duration-200"
                    >
                        <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                            <i className="ri-parking-box-line text-white text-sm"></i>
                        </div>
                        <span className="text-gray-300 text-sm">Parking Area</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LocationSearchPanel
