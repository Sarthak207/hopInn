const mongoose = require('mongoose');
const CampusLocation = require('../models/campusLocation.model');

// Official IIT Bombay campus locations based on campus map grid coordinates
const iitBombayLocations = [
    // Main Gates
    {
        name: 'Main Gate',
        coordinates: { latitude: 19.133636, longitude: 72.915358 },
        type: 'gate',
        description: 'Main Gate (Gate No. 2) - Primary entrance to IIT Bombay',
        aliases: ['Gate No. 2', 'Main Entrance'],
        building: 'F3'
    },
    {
        name: 'Market Gate',
        coordinates: { latitude: 19.135000, longitude: 72.913000 },
        type: 'gate',
        description: 'Market Gate near residential areas',
        aliases: ['Market Entry'],
        building: 'E5'
    },
    {
        name: 'Lake Side Gate',
        coordinates: { latitude: 19.130000, longitude: 72.920000 },
        type: 'gate',
        description: 'Lake Side Gate facing Powai Lake',
        aliases: ['Powai Lake Gate'],
        building: 'F1'
    },

    // Hostels (18 total - official from campus map)
    {
        name: 'Hostel 1',
        coordinates: { latitude: 19.128000, longitude: 72.914000 },
        type: 'hostel',
        description: 'Boys hostel H1',
        aliases: ['H1'],
        building: 'A3'
    },
    {
        name: 'Hostel 2',
        coordinates: { latitude: 19.129000, longitude: 72.914500 },
        type: 'hostel',
        description: 'Boys hostel H2',
        aliases: ['H2'],
        building: 'A2'
    },
    {
        name: 'Hostel 3',
        coordinates: { latitude: 19.129500, longitude: 72.915000 },
        type: 'hostel',
        description: 'Boys hostel H3',
        aliases: ['H3'],
        building: 'A2'
    },
    {
        name: 'Hostel 4',
        coordinates: { latitude: 19.130000, longitude: 72.915500 },
        type: 'hostel',
        description: 'Boys hostel H4',
        aliases: ['H4'],
        building: 'A2'
    },
    {
        name: 'Hostel 5',
        coordinates: { latitude: 19.130500, longitude: 72.916000 },
        type: 'hostel',
        description: 'Boys hostel H5',
        aliases: ['H5'],
        building: 'B2'
    },
    {
        name: 'Hostel 6',
        coordinates: { latitude: 19.131000, longitude: 72.916500 },
        type: 'hostel',
        description: 'Boys hostel H6',
        aliases: ['H6'],
        building: 'B1'
    },
    {
        name: 'Hostel 7',
        coordinates: { latitude: 19.131500, longitude: 72.917000 },
        type: 'hostel',
        description: 'Boys hostel H7',
        aliases: ['H7'],
        building: 'B1'
    },
    {
        name: 'Hostel 8',
        coordinates: { latitude: 19.132000, longitude: 72.917500 },
        type: 'hostel',
        description: 'Boys hostel H8',
        aliases: ['H8'],
        building: 'B2'
    },
    {
        name: 'Hostel 9',
        coordinates: { latitude: 19.132500, longitude: 72.918000 },
        type: 'hostel',
        description: 'Boys hostel H9',
        aliases: ['H9'],
        building: 'B1'
    },
    {
        name: 'Hostel 10',
        coordinates: { latitude: 19.133000, longitude: 72.918500 },
        type: 'hostel',
        description: 'Girls hostel H10',
        aliases: ['H10', 'Girls Hostel'],
        building: 'D3'
    },
    {
        name: 'Hostel 11',
        coordinates: { latitude: 19.133500, longitude: 72.919000 },
        type: 'hostel',
        description: 'Girls hostel H11',
        aliases: ['H11', 'Girls Hostel'],
        building: 'C2'
    },
    {
        name: 'Hostel 12',
        coordinates: { latitude: 19.127500, longitude: 72.915500 },
        type: 'hostel',
        description: 'Boys hostel H12',
        aliases: ['H12'],
        building: 'A1'
    },
    {
        name: 'Hostel 13',
        coordinates: { latitude: 19.131000, longitude: 72.917000 },
        type: 'hostel',
        description: 'Boys hostel H13',
        aliases: ['H13'],
        building: 'B1'
    },
    {
        name: 'Hostel 14',
        coordinates: { latitude: 19.131500, longitude: 72.917500 },
        type: 'hostel',
        description: 'Boys hostel H14',
        aliases: ['H14'],
        building: 'B1'
    },
    {
        name: 'Hostel 15',
        coordinates: { latitude: 19.132000, longitude: 72.918000 },
        type: 'hostel',
        description: 'Girls hostel H15',
        aliases: ['H15', 'Girls Hostel'],
        building: 'D4'
    },
    {
        name: 'Hostel 16',
        coordinates: { latitude: 19.132500, longitude: 72.918500 },
        type: 'hostel',
        description: 'Mixed hostel H16 (Girls wing)',
        aliases: ['H16'],
        building: 'D4'
    },
    {
        name: 'Tansa House',
        coordinates: { latitude: 19.133000, longitude: 72.917000 },
        type: 'hostel',
        description: 'Project staff hostel - Tansa House',
        aliases: ['Tansa'],
        building: 'B2'
    },

    // Academic Buildings (from official campus map)
    {
        name: 'Main Building',
        coordinates: { latitude: 19.133636, longitude: 72.915358 },
        type: 'academic',
        description: 'Main Building - Central administration and academics',
        aliases: ['Main Building'],
        building: 'C3'
    },
    {
        name: 'Central Library',
        coordinates: { latitude: 19.132500, longitude: 72.916000 },
        type: 'academic',
        description: 'Central Library',
        aliases: ['Library'],
        building: 'C3'
    },
    {
        name: 'Lecture Hall Complex-1',
        coordinates: { latitude: 19.133000, longitude: 72.916500 },
        type: 'academic',
        description: 'Lecture Hall Complex-1',
        aliases: ['LHC-1'],
        building: 'D4'
    },
    {
        name: 'Lecture Hall Complex-2',
        coordinates: { latitude: 19.133500, longitude: 72.916800 },
        type: 'academic',
        description: 'Lecture Hall Complex-2',
        aliases: ['LHC-2'],
        building: 'D4'
    },
    {
        name: 'Victor Menezes Convention Centre',
        coordinates: { latitude: 19.133200, longitude: 72.916200 },
        type: 'academic',
        description: 'Victor Menezes Convention Centre',
        aliases: ['VMCC', 'Convention Centre'],
        building: 'C4'
    },
    {
        name: 'Convocation Hall',
        coordinates: { latitude: 19.133400, longitude: 72.916400 },
        type: 'academic',
        description: 'Convocation Hall',
        aliases: ['Convocation Hall'],
        building: 'C3'
    },

    // Sports and Recreation
    {
        name: 'Students Activity Centre',
        coordinates: { latitude: 19.132000, longitude: 72.916800 },
        type: 'sports',
        description: 'Students Activity Centre (SAC)',
        aliases: ['SAC'],
        building: 'B3'
    },
    {
        name: 'Swimming Pool',
        coordinates: { latitude: 19.131500, longitude: 72.917200 },
        type: 'sports',
        description: 'Swimming Pool Complex',
        aliases: ['Pool'],
        building: 'B3'
    },
    {
        name: 'Gymkhana',
        coordinates: { latitude: 19.131800, longitude: 72.917500 },
        type: 'sports',
        description: 'Gymkhana - Sports complex',
        aliases: ['Gym', 'Sports Complex'],
        building: 'B3'
    },

    // Dining
    {
        name: 'Gulmohar Restaurant',
        coordinates: { latitude: 19.133200, longitude: 72.916600 },
        type: 'dining',
        description: 'Gulmohar Restaurant - Main dining facility',
        aliases: ['Gulmohar'],
        building: 'D3'
    },
    {
        name: 'Staff Canteen',
        coordinates: { latitude: 19.133000, longitude: 72.916400 },
        type: 'dining',
        description: 'Staff Canteen',
        aliases: ['Staff Canteen'],
        building: 'C3'
    },

    // Medical and Services
    {
        name: 'Hospital',
        coordinates: { latitude: 19.133000, longitude: 72.916200 },
        type: 'medical',
        description: 'IIT Bombay Hospital',
        aliases: ['IIT Hospital', 'Medical Center'],
        building: 'C3'
    },
    {
        name: 'Post Office',
        coordinates: { latitude: 19.134000, longitude: 72.914000 },
        type: 'other',
        description: 'Campus Post Office',
        aliases: ['Post Office'],
        building: 'E5'
    },

    // Banks and ATMs (from campus map)
    {
        name: 'Canara Bank',
        coordinates: { latitude: 19.133200, longitude: 72.916600 },
        type: 'other',
        description: 'Canara Bank branch',
        aliases: ['Canara Bank'],
        building: 'D3'
    },
    {
        name: 'State Bank of India',
        coordinates: { latitude: 19.134200, longitude: 72.913200 },
        type: 'other',
        description: 'State Bank of India branch',
        aliases: ['SBI', 'State Bank'],
        building: 'F3'
    }
];

// Seeder function
const seedCampusLocations = async () => {
    try {
        // Clear existing locations
        await CampusLocation.deleteMany({});
        
        // Insert new locations
        await CampusLocation.insertMany(iitBombayLocations);
        
        console.log('✅ IIT Bombay campus locations seeded successfully!');
        console.log(`📍 Inserted ${iitBombayLocations.length} locations`);
        
        // Display summary
        const summary = iitBombayLocations.reduce((acc, loc) => {
            acc[loc.type] = (acc[loc.type] || 0) + 1;
            return acc;
        }, {});
        
        console.log('📊 Location Summary:');
        Object.entries(summary).forEach(([type, count]) => {
            console.log(`   ${type}: ${count} locations`);
        });
        
    } catch (error) {
        console.error('❌ Error seeding campus locations:', error);
    }
};

module.exports = { seedCampusLocations, iitBombayLocations };
