// Import the express module
const express = require("express");
// Call the router method from express to create the router
const router = express.Router();
// Import the vehicle controller
const vehicleControllers = require("../controllers/vehicle.controller");
// Create a route to handle the craete vehicle request on post
router.post("/api/vehicle", vehicleControllers.createVehicle);
// Create a route to handle the get single vehicle request on Get by vehicle_id
router.get("/api/vehicle/:id", vehicleControllers.getSingleVehicleById);
// Create a route to handle the get single vehicle request on Get by customer_id
router.get("/api/vehicles/:customer_id", vehicleControllers.getVehiclesPerCustomer);
// Create a route to handle the update vehicle request on put
router.put("/api/vehicle/:vehicle_id", vehicleControllers.updateVehicle);
// Export the router
module.exports = router;
