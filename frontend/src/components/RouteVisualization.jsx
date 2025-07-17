import React, { useState, useEffect } from 'react';
import { APIProvider, Map, Marker, useMapsLibrary, useMap } from '@vis.gl/react-google-maps';

const RouteVisualization = ({ 
  pickup, 
  destination, 
  driverLocation = null, 
  showRoute = true,
  onRouteCalculated = null 
}) => {
  const [directionsService, setDirectionsService] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // IIT Bombay campus center
  const IITB_CENTER = { lat: 19.133636, lng: 72.915358 };

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden border border-gray-300 relative">
      <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <Map
          defaultCenter={IITB_CENTER}
          defaultZoom={16}
          gestureHandling="greedy"
          disableDefaultUI={false}
        >
          <Directions 
            pickup={pickup}
            destination={destination}
            driverLocation={driverLocation}
            showRoute={showRoute}
            onRouteCalculated={onRouteCalculated}
            setRouteInfo={setRouteInfo}
            setIsLoading={setIsLoading}
          />
        </Map>
      </APIProvider>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Calculating route...</p>
          </div>
        </div>
      )}

      {/* Route Information */}
      {routeInfo && (
        <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg p-4 shadow-lg">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-gray-800">Route Information</h3>
            <span className="text-sm text-gray-600">{routeInfo.distance}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <span className="mr-4">🕐 {routeInfo.duration}</span>
            <span>📍 {pickup?.name} → {destination?.name}</span>
          </div>
        </div>
      )}
    </div>
  );
};

// Separate Directions component using hooks
function Directions({ pickup, destination, driverLocation, showRoute, onRouteCalculated, setRouteInfo, setIsLoading }) {
  const map = useMap();
  const routesLibrary = useMapsLibrary('routes');
  const [directionsService, setDirectionsService] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);

  // Initialize directions service and renderer
  useEffect(() => {
    if (!routesLibrary || !map) return;
    
    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(new routesLibrary.DirectionsRenderer({
      suppressMarkers: false,
      polylineOptions: {
        strokeColor: '#4285F4',
        strokeWeight: 4,
        strokeOpacity: 0.8
      },
      map: map
    }));
  }, [routesLibrary, map]);

  // Calculate route when pickup/destination changes
  useEffect(() => {
    if (!pickup || !destination || !directionsService || !directionsRenderer || !showRoute) return;

    calculateRoute();
  }, [pickup, destination, directionsService, directionsRenderer, showRoute]);

  const calculateRoute = async () => {
    if (!pickup || !destination || !directionsService || !directionsRenderer) return;

    setIsLoading(true);
    
    const origin = new window.google.maps.LatLng(
      pickup.coordinates.latitude, 
      pickup.coordinates.longitude
    );
    const dest = new window.google.maps.LatLng(
      destination.coordinates.latitude, 
      destination.coordinates.longitude
    );

    const request = {
      origin: origin,
      destination: dest,
      travelMode: window.google.maps.TravelMode.DRIVING,
      avoidHighways: false,
      avoidTolls: false
    };

    try {
      const response = await directionsService.route(request);
      
      if (response.status === 'OK') {
        const route = response.routes[0];
        const leg = route.legs[0];
        
        const routeData = {
          distance: leg.distance.text,
          duration: leg.duration.text,
          steps: leg.steps.map(step => ({
            instruction: step.instructions,
            distance: step.distance.text,
            duration: step.duration.text
          }))
        };

        setRouteInfo(routeData);
        
        if (onRouteCalculated) {
          onRouteCalculated(routeData);
        }

        directionsRenderer.setDirections(response);
      } else {
        console.error('Directions request failed:', response.status);
      }
    } catch (error) {
      console.error('Error calculating route:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Render markers for pickup, destination, and driver
  return (
    <>
      {/* Pickup Marker */}
      {pickup && (
        <Marker
          position={{
            lat: pickup.coordinates.latitude,
            lng: pickup.coordinates.longitude
          }}
          title={`Pickup: ${pickup.name}`}
        />
      )}

      {/* Destination Marker */}
      {destination && (
        <Marker
          position={{
            lat: destination.coordinates.latitude,
            lng: destination.coordinates.longitude
          }}
          title={`Destination: ${destination.name}`}
        />
      )}

      {/* Driver Location Marker */}
      {driverLocation && (
        <Marker
          position={{
            lat: driverLocation.latitude,
            lng: driverLocation.longitude
          }}
          title="Driver Location"
        />
      )}
    </>
  );
}

export default RouteVisualization;
