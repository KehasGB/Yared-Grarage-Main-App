const api_url = import.meta.env.VITE_REACT_APP_API_URL;
// A function to send post request to create a new services
async function createService(service) {
	// Send POST Request with the service object as data in JSON format
	const request = {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(service),
	};

	try {
		const response = await fetch(`${api_url}/api/service`, request);

		return response;
	} catch (error) {
		console.error("Error creating service:", error);
		throw error;
	}
}

//  A function to get all services
async function getAllServices() {
	const request = {
		method: "GET",
		headers: { "Content-Type": "application/json" },
	};

	try {
		const response = await fetch(`${api_url}/api/services`, request);
		return response;
	} catch (error) {
		console.error("Error fetching services:", error);
		throw error;
	}
}

async function getSingleService(id) {
	const request = {
		method: "GET",
		headers: { "Content-Type": "application/json" },
	};

	try {
		const response = await fetch(`${api_url}/api/service/` + id, request);
		return response;
	} catch (error) {
		console.error("Error fetching single service:", error);
		throw error;
	}
}

async function updateService(service_Id, updatedService) {
	const request = {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(updatedService),
	};

	try {
		const response = await fetch(
			`${api_url}/api/service/${service_Id}`,
			request
		);
		return response;
	} catch (error) {
		console.error("Error updating service:", error);
		throw error;
	}
}

// Delete a service by ID
async function deleteService(service_Id) {
	const request = {
		method: "DELETE",
		headers: { "Content-Type": "application/json" },
	};

	try {
		const response = await fetch(
			`${api_url}/api/service/${service_Id}`,
			request
		);
		return await response.json();
	} catch (error) {
		console.error("Error deleting service:", error);
		throw error;
	}
}
const serviceService = {
	createService,
	getAllServices,
	getSingleService,
	updateService,
	deleteService,
	getSingleService,
};

// Export the functions
export default serviceService;
