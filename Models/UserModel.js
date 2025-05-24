const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
name: {
    type: String,
    required: true,
},
email: {
    type: String,
    required: true,
    unique: true,
},
password: {
    type: String,
    required: true,
},
isAdmin: {
    type: Boolean,
    default: false,
},
street: {
    type: String,
    default: "",
},
apartment: {
    type: String,
    default: "",
},
city: {
    type: String,
    default: "",
},
zip: {
    type: String,
    default: "",
},
country: {
    type: String,
    default: "",
},

phone: {
    type: String,
    default: "",
},







});
module.exports.User = mongoose.model('User', userSchema);