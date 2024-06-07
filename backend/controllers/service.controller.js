// import service service
const serviceService = require("../services/service.service");

// write a function to get all services
async function getAllServices(req, res, next) {
	try {
		const services = await serviceService.getAllServices();
		res.status(200).json({
			services,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			error: "Internal Server Error",
		});
	}
}

// Get Single Service
async function getServiceById(req, res) {
	try {
		const serviceId = req.params.id;
		const service = await serviceService.getServiceById(serviceId);
		res.json(service);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}

// Add New Service
async function addNewService(req, res) {
	const serviceExists = await serviceService.checkIfServiceExists(
		req.body.service_name
	);
	// If employee exists, send a response to the client
	if (serviceExists) {
		res.status(400).json({
			error: "This service already exists!",
		});
	} else {
		try {
			const { service_name, service_description } = req.body;
			await serviceService.addNewService(service_name, service_description);
			res.json({ success: true });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	}
}

//  write a function to update services
async function updateService(req, res, next) {
	try {
		const updatedService = await serviceService.updateService(
			req.params.service_id,
			req.body
		);

		if (!updatedService)
			return res.status(404).json({ message: "service not found" });
		res.status(200).json({ status: "true", message: updatedService });
	} catch (error) {
		console.error("Error fetching services:", error);

		// Provide a meaningful response to the client
		res.status(500).json({
			error: "Internal Server Error",
			message:
				"An error occurred while fetching services. Please try again later.",
		});
	}
}

// Export the finctions
module.exports = {
	getAllServices,
	getServiceById,
	addNewService,
	updateService,
};
