const mongoose = require('mongoose');

const ConnectDB = async () => {
    try {
       await mongoose.connect(process.env.MONGO_URI);
         console.log('MongoDB connected');
        console.log('Database Name:', mongoose.connection.name);
    }
    catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = ConnectDB;