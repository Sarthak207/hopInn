import React, { useState } from 'react';
import CampusLocationPicker from './CampusLocationPicker';
import IITBombayMap from './IITBombayMap';

const CampusRideForm = ({ onSubmit }) => {
  const [pickup, setPickup] = useState(null);
  const [destination, setDestination] = useState(null);
  const [fare, setFare] = useState('');
  const [seats, setSeats] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!pickup || !destination) {
      alert('Please select both pickup and destination locations');
      return;
    }
    
    onSubmit({
      pickup,
      destination,
      fare: parseFloat(fare),
      availableSeats: seats
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Create IIT Bombay Campus Ride</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pickup Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pickup Location
            </label>
            <CampusLocationPicker
              onLocationSelect={setPickup}
              selectedLocation={pickup}
              placeholder="Select pickup location"
            />
          </div>

          {/* Destination */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Destination
            </label>
            <CampusLocationPicker
              onLocationSelect={setDestination}
              selectedLocation={destination}
              placeholder="Select destination"
            />
          </div>

          {/* Fare */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fare (₹)
            </label>
            <input
              type="number"
              value={fare}
              onChange={(e) => setFare(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter fare amount"
              min="0"
              step="0.01"
              required
            />
          </div>

          {/* Available Seats */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Available Seats
            </label>
            <select
              value={seats}
              onChange={(e) => setSeats(parseInt(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value={1}>1 Seat</option>
              <option value={2}>2 Seats</option>
              <option value={3}>3 Seats</option>
              <option value={4}>4 Seats</option>
            </select>
          </div>
        </div>

        {/* Map Preview */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Route Preview
          </label>
          <IITBombayMap
            selectedLocation={pickup}
            onLocationSelect={setPickup}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Create Ride
        </button>
      </form>
    </div>
  );
};

export default CampusRideForm;
