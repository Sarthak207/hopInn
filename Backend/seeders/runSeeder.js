const mongoose = require('mongoose');
const { seedCampusLocations } = require('./campusLocationSeeder');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://0.0.0.0/ridePool', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const runSeeder = async () => {
    try {
        console.log('🌱 Starting IIT Bombay campus seeding...');
        await seedCampusLocations();
        console.log('🎉 Seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

runSeeder();
