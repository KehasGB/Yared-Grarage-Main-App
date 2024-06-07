// import express module
const express = require("express");
// Call the router method from express to create the router
const router = express.Router();
// Import the order controller
const orderController = require("../controllers/order.controller");
// Import middleware 
const authMiddleware = require("../middlewares/auth.middleware");

// Create a route to handle the order request on POST
router.post("/api/order", orderController.createOrder);

// Create a route to handle the order request on geta
router.get("/api/orders", orderController.getAllOrders);
// Create a route to handle the order request on get by orderid
router.get("/api/order/:order_id", [authMiddleware.verifyToken, authMiddleware.isAdmin], orderController.getOrderById);
// Create a route to handle the order request on get by customer id
router.get(
	"/api/customer-orders/:customer_id",
	[authMiddleware.verifyToken, authMiddleware.isAdmin],
	orderController.getOrdersByCustomerId
);
// Create a route to handle the order update request on put
router.put("/api/order/:order_id",[authMiddleware.verifyToken, authMiddleware.isManager], orderController.updateOrder);
// create aroute to get order by hash 
router.get("/api/orderStatus/:hash", orderController.getOrderByOrderHash);

// Export the router
module.exports = router;
