// Import the query function from the db.config.js file
const conn = require("../config/db.config");
// A function to check if service exists in the database
async function checkIfServiceExists(service_name) {
	const sql = `SELECT * FROM common_services WHERE service_name=?`;
	let results = await conn.query(sql, [service_name]);
	if (results.length > 0) {
		return true;
	}
	false;
}

// Get Single Service
async function getServiceById(serviceId) {
	try {
		const query = "SELECT * FROM common_services WHERE service_id = ?";
		const [service] = await conn.query(query, [serviceId]);
		return service;
	} catch (error) {
		throw error;
	}
}

// Add New Service
async function addNewService(serviceName, serviceDescription) {
	try {
		const query =
			"INSERT INTO common_services (service_name, service_description) VALUES (?, ?)";
		await conn.query(query, [serviceName, serviceDescription]);
	} catch (error) {
		throw error;
	}
}
// A function to get a all services
async function getAllServices() {
	try {
		// Execute the SQL query to fetch all services from the common_services table
		const rows = await conn.query(
			"SELECT * FROM common_services ORDER BY service_id DESC LIMIT 10"
		);

		// Return the retrieved rows
		return rows;
	} catch (error) {
		console.log(error.message);
		return [];
	}
}

// A function to update services
async function updateService(service_id, newData) {
	try {
		// Update data in the common_services table
		const updatedData = await conn.query(
			"UPDATE common_services SET service_name=?, service_description=? WHERE service_id=?",
			[newData.service_name, newData.service_description, service_id]
		);

		// Check if the update was successful
		if (updatedData.affectedRows === 1) {
			// If yes, return the updated data
			//
			console.log(
				`Service with service_id ${service_id} updated successfully.`
			);
			return true;
			// Construct the updated services
		} else {
			console.log(`No records updated for service_id ${service_id}.`);
			return false;
		}
	} catch (error) {
		console.error("Error updating service:", error);
		throw error;
	}
}

//export
module.exports = {
	checkIfServiceExists,
	getServiceById,
	addNewService,
	getAllServices,
	updateService,
};
