const mongoose = require('mongoose');
const orderItemSchema = mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
   
});
const OrderItem = mongoose.model('OrderItem', orderItemSchema);
module.exports = { OrderItem };