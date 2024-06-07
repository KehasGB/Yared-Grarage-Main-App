let express = require("express");

let router = express.Router();

// Import the install routes
let installRouter = require("./install.routes");
// Import the employee routes
const employeeRouter = require("./employee.routes");
// Import the login routes
const loginRoutes = require("./login.routes");
// // Import the customer routes
const customerRoutes = require("./customer.routes");
// // Import the order routes
const orderRoutes = require("./order.routes");
// // Import the service routes
const serviceRoutes = require("./service.routes");
// // Import the vehicle routes
const vehicleRoutes = require("./vehicle.routes");
// // Add the install router to the main router
router.use(installRouter);
// Add the employee routes to the main router
router.use(employeeRouter);
// Add the login routes to the main router
router.use(loginRoutes);
// Add the customer routes to the main router
router.use(customerRoutes);
// // Add the order routes to the main router
router.use(orderRoutes);
// // Add the service routes to the main router
router.use(serviceRoutes);
// // Add the vehicle routes to the main router
router.use(vehicleRoutes);
// export router
// router.use(vehicleRoutes);

module.exports = router;
