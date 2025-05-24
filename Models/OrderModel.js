const mongoose = require('mongoose');
 
const orderSchema = mongoose.Schema({
});

module.exports.Order = mongoose.model('Order', orderSchema);