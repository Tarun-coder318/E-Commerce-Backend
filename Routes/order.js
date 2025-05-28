const express = require("express");
const router = express.Router();
const { Order } = require("../Models/OrderModel.js");
const { OrderItem } = require("../Models/orderitems.js");
const { populate } = require("dotenv");
// const { User} = require('../Models/UserModel.js');

router.get("/", async (req, res) => {
  const orderPresent = await Order.find().populate("user");
  if (orderPresent) {
    res.status(200).json({
      message: "Orders fetched successfully",
      orders: orderPresent,
    });
  } else {
    res.send(500).json({
      message: "Error fetching orders",
      error: error,
    });
  }
});

router.get("/:id", async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name")
    .populate({
      path: "orderItems",
      populate: { path: "product", populate: "category" },
    });
  if (!order) {
    res.status(200).json({
      message: " error fetching order by Id",
    });
  }
  res.send(order);
});

router.post("/", async (req, res) => {
  try {
    const orderItemsIds = await Promise.all(
      req.body.orderItems.map(async (orderItem) => {
        let newOrderItem = new OrderItem({
          quantity: orderItem.quantity,
          product: orderItem.product,
        });

        newOrderItem = await newOrderItem.save();
        return newOrderItem._id;
      })
    );
    const orderItemsIdsResolved = orderItemsIds;
    const totalprices = await Promise.all(
      orderItemsIdsResolved.map(async (orderItemsId) => {
        const Items = await OrderItem.findById(orderItemsId).populate(
          "product",
          "price"
        );
        const totalPrice = Items.product.price * Items.quantity;
        return totalPrice;
      })
    );
    console.log(totalprices);

    const totalPrice = totalprices.reduce((acc, curr) => acc + curr, 0);

    const order = new Order({
      orderItems: orderItemsIdsResolved,
      shippingAddress1: req.body.shippingAddress1,
      shippingAddress2: req.body.shippingAddress2,
      city: req.body.city,
      zip: req.body.zip,
      country: req.body.country,
      phone: req.body.phone,
      status: req.body.status,
      totalPrice: totalPrice,
      user: req.body.user,
    });
    const newOrderItem = await order.save();
    if (newOrderItem)
      res.status(200).json({
        message: "Order created ",
        order: order, // this is a Mongoose document instance but not persisted
      });
  } catch (error) {
    console.error("Order creation failed:", error);
    res.status(500).json({
      message: "Error creating order",
      error: error,
    });
  }
});

router.put("/:id", async (req, res) => {
  const orderUpdate = await Order.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
    },
    { new: true }
  );
  if (!orderUpdate) return res.status(400).send("order is not updated");
  res.send(orderUpdate);
});

router.delete("/:id", async (req, res) => {
  try {
    
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

   
    await Promise.all(
      order.orderItems.map((orderItemId) => {
        return OrderItem.findByIdAndDelete(orderItemId);
      })
    );

    return res.status(200).json({ message: "Order and order items deleted" });
  } catch (err) {
    console.error("Error deleting order:", err);
    return res
      .status(500)
      .json({ error: err.message || "Internal Server Error" });
  }
});

router.get("/get/totalsales", async (req, res) => {
  const totalsales = await Order.aggregate([
    { $group: { _id: null, totalsales: { $sum: "$totalPrice" } } },
  ]);
  if (!totalsales) {
    res.status(400).send("The order sales cannot genrated");
  }
  res.send({ totalsale: totalsales[0]?.totalsales || 0 });
});

router.get("/get/count", async (req, res) => {
  const orderCount = await Order.countDocuments();
  if (!orderCount) {
    return res.status(404).json({ message: "order not found" });
  }
  res.send({ orderCount: orderCount });
});

router.get("/get/userorders/:user_Id", async (req, res) => {
  const orderHistory = await Order.find({ user: req.params.user_Id })
    .populate({
      path: "orderItems",
      populate: {
        path: "product",
        populate: "category",
      },
    })
    .sort({ dateOrdered: -1 });

  if (!orderHistory) {
    return res.status(404).json({
      message: "NO order History",
    });
  }
  res.send({ orderHistory: orderHistory });
});

module.exports = router;
