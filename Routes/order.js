const express = require('express');
const router = express.Router();
const { Order } = require('../Models/OrderModel.js');

router.get('/', async (req, res) => {
    const orderPresent = await Order.find()
    if(orderPresent) {
        res.send(200).json({
            message: 'Orders fetched successfully',
            orders: orderPresent,
        });
    }
    else{
        res.send(500).json({
            message: 'Error fetching orders',
            error: error,
        })
    }
}
);

module.exports = router;