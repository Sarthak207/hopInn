import React, { useState, useEffect } from 'react';
import { APIProvider, Map, Marker, InfoWindow } from '@vis.gl/react-google-maps';
import axios from 'axios';

const IITBombayMap = ({ 
  selectedLocation, 
  onLocationSelect, 
  showRoute = false, 
  routeStart = null, 
  routeEnd = null 
}) => {
  const [campusLocations, setCampusLocations] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [loading, setLoading] = useState(false);

  // IIT Bombay campus center coordinates
  const IITB_CENTER = { lat: 19.133636, lng: 72.915358 };
  const IITB_BOUNDS = {
    north: 19.140000,
    south: 19.125000,
    east: 72.925000,
    west: 72.910000
  };

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
        setCampusLocations(response.data.locations);
      }
    } catch (error) {
      console.error('Error fetching campus locations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMarkerColor = (type) => {
    const colors = {
      gate: '#3B82F6',      // Blue
      hostel: '#10B981',    // Green
      academic: '#8B5CF6',  // Purple
      sports: '#F59E0B',    // Orange
      dining: '#EF4444',    // Red
      medical: '#EC4899',   // Pink
      other: '#6B7280'      // Gray
    };
    return colors[type] || '#6B7280';
  };

  const handleMarkerClick = (location) => {
    setSelectedMarker(location);
    if (onLocationSelect) {
      onLocationSelect(location);
    }
  };

  const customMapStyle = [
    {
      featureType: "poi.school",
      elementType: "labels",
      stylers: [{ visibility: "on" }]
    },
    {
      featureType: "landscape",
      elementType: "geometry",
      stylers: [{ color: "#f5f5f5" }]
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading IIT Bombay campus map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden border border-gray-300">
      <APIProvider 
        apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
        onLoad={() => console.log('Maps API loaded for IIT Bombay')}
      >
        <Map
          defaultCenter={IITB_CENTER}
          defaultZoom={16}
          gestureHandling="greedy"
          disableDefaultUI={false}
          styles={customMapStyle}
          restriction={{
            latLngBounds: IITB_BOUNDS,
            strictBounds: true
          }}
          mapTypeId="roadmap"
        >
          {/* Campus Location Markers */}
          {campusLocations.map((location) => (
            <Marker
              key={location._id}
              position={{
                lat: location.coordinates.latitude,
                lng: location.coordinates.longitude
              }}
              onClick={() => handleMarkerClick(location)}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: getMarkerColor(location.type),
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 2
              }}
            />
          ))}

          {/* Selected Location Marker (if any) */}
          {selectedLocation && (
            <Marker
              position={{
                lat: selectedLocation.coordinates.latitude,
                lng: selectedLocation.coordinates.longitude
              }}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 12,
                fillColor: '#FF0000',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 3
              }}
            />
          )}

          {/* Info Window for Selected Marker */}
          {selectedMarker && (
            <InfoWindow
              position={{
                lat: selectedMarker.coordinates.latitude,
                lng: selectedMarker.coordinates.longitude
              }}
              onCloseClick={() => setSelectedMarker(null)}
            >
              <div className="p-4 max-w-sm">
                <h3 className="font-semibold text-lg mb-2">{selectedMarker.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{selectedMarker.description}</p>
                <div className="flex items-center mb-2">
                  <span className={`inline-block px-2 py-1 text-xs rounded-full mr-2 ${
                    selectedMarker.type === 'gate' ? 'bg-blue-100 text-blue-800' :
                    selectedMarker.type === 'hostel' ? 'bg-green-100 text-green-800' :
                    selectedMarker.type === 'academic' ? 'bg-purple-100 text-purple-800' :
                    selectedMarker.type === 'sports' ? 'bg-orange-100 text-orange-800' :
                    selectedMarker.type === 'dining' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedMarker.type}
                  </span>
                  <span className="text-xs text-gray-500">Building: {selectedMarker.building}</span>
                </div>
                {selectedMarker.aliases.length > 0 && (
                  <p className="text-xs text-gray-500">
                    Also known as: {selectedMarker.aliases.join(', ')}
                  </p>
                )}
              </div>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>
    </div>
  );
};

export default IITBombayMap;
