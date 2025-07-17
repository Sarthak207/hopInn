const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
            minlength: [ 3, 'First name must be at least 3 characters long' ],
        },
        lastname: {
            type: String,
            minlength: [ 3, 'Last name must be at least 3 characters long' ],
        }
    },
    email: {
    type: String,
    required: true,
    unique: true,
    minlength: [5, 'Email must be at least 5 characters long'],
    validate: [
        {
            validator: function(email) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            },
            message: 'Please enter a valid email'
        },
        {
            validator: function(email) {
                // Allow both regular emails AND IIT Bombay emails
                // Set COLLEGE_MODE=true in .env to enforce IIT Bombay emails only
                return !process.env.COLLEGE_MODE || email.endsWith('@iitb.ac.in');
            },
            message: 'Please use your IIT Bombay email address (@iitb.ac.in)'
        }
        ]
    },
    password: { 
        type: String,
        required: true,
        select: false,
    },
    socketId: {
        type: String,
    },
    // Add these new fields for IIT Bombay specific data
    college: {
        type: String,
        default: process.env.COLLEGE_MODE ? 'IIT Bombay' : null
    },
hostel: {
    type: String,
    enum: ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8', 'H9', 'H10', 'H11', 'H12', 'H13', 'H14', 'H15', 'H16', 'H18', 'Tansa', null],
    required: false
},
department: {
    type: String,
    required: false
},
rollNumber: {
    type: String,
    required: false,
    unique: true,
    sparse: true // Allows multiple null values
}

})

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return token;
}

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
}

const userModel = mongoose.model('user', userSchema);


module.exports = userModel;