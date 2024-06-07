// Import the vehicle service
const vehicleService = require("../services/vehicle.service");
// Create the add vehicle controller
async function createVehicle(req, res, next) {
	// Check if vehicle_serial already exists in the database
	const vehicleExists = await vehicleService.checkIfVehicleExists(
		req.body.vehicle_serial
	);
	if (vehicleExists) {
		res.status(400).json({
			error: "This vehicle is already registered!",
		});
	} else {
		try {
			const vehicleData = req.body;

			// Create the vehicle
			const vehicle = await vehicleService.createVehicle(vehicleData);
			if (vehicle.status === "fail") {
				 res.status(400).json({
					status: vehicle.status,
					message: vehicle.message,
				});
			} else {
				res.status(200).json({
					status: "true",
					vehicle: vehicle.vehicle_make,
					owner: vehicle.owner,
				});
			}
		} catch (error) {
			console.log(error);
			res.status(400).json({
				error: "Something went wrong!",
			});
		}
	}
}



// Create the update vehicle controller
async function updateVehicle(req, res, next) {
	try {
		const vehicleId = req.params.vehicle_id;
		const updatedVehicle = await vehicleService.updateVehicle(
			vehicleId,
			req.body
		);

		if (updatedVehicle.status === "fail") {
			res.status(404).json({
				status: updatedVehicle.status,
				message: updatedVehicle.message,
			});
		}

		res.status(200).json({
			status: "success",
			updatedInfo: updatedVehicle,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			error: "Internal Server Error",
		});
	}
}
const getSingleVehicleById = async (req, res) => {
	try {
		const vehicleId = req.params.id;
		const vehicle = await vehicleService.getSingleVehicleById(vehicleId);

		if (!vehicle) {
			return res.status(404).json({
				error: "vehicle not found",
			});
		}

		res.status(200).json(vehicle);
	} catch (error) {
		console.error(error);
		res.status(500).json({
			error: "Internal Server Error",
		});
	}
};
// Create the get vehicle by customer_id controller
async function getVehiclesPerCustomer(req, res, next) {
	try {
		const id = req.params.customer_id;
		const vehicle = await vehicleService.getVehiclesPerCustomer(id);
		// If the vehicle is not found
		if (vehicle.status === "fail") {
			res.status(400).json({
				status: vehicle.status,
				message: vehicle.message,
			});
		}

		res.status(200).json(vehicle);
	} catch (error) {
		console.log(error.message);
	}
}
// Export the createVehicle controller
module.exports = {
	createVehicle,
	updateVehicle,
	getSingleVehicleById,
	getVehiclesPerCustomer,
};
