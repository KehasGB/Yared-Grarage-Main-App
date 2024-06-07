const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customer.controller");
// Import middleware 
const authMiddleware = require("../middlewares/auth.middleware");

// Get all routes for customers
router.get("/api/customers",[authMiddleware.verifyToken, authMiddleware.isManager], customerController.getAllCustomers);
// Get routes for customer by ID
router.get("/api/customer/:id", customerController.getSingleCustomer);
// Create routes for customers
router.post("/api/customer",[authMiddleware.verifyToken, authMiddleware.isManager], customerController.createCustomer);
// Updateroutes for customer
router.put("/api/customer/:id", [authMiddleware.verifyToken, authMiddleware.isManager], customerController.updateCustomer);

module.exports = router;
