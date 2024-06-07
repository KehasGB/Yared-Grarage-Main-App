// Import the query function from the db.config.js file
const conn = require("../config/db.config");
// Import the bcrypt module
const bcrypt = require("bcrypt");

// A function to check if a customer exists in the database
async function checkIfCustomerExists(email) {
	const query = "SELECT * FROM customer_identifier WHERE customer_email = ?";
	const rows = await conn.query(query, [email]);
	if (rows.length > 0) {
		return true;
	}
	return false;
}

// A function to create a new customer
async function createCustomer(customer) {
	try {
		// Insert data into customer_identifier table
		const query1 =
			"INSERT INTO customer_identifier (customer_email, customer_phone_number, customer_hash) VALUES (?, ?, ?)";
		const rows1 = await conn.query(query1, [
			customer.customer_email,
			customer.customer_phone_number,
			customer.customer_hash,
		]);

		if (rows1.affectedRows !== 1) {
			return false;
		}

		// Get the customer_id from the insert
		const customer_id = rows1.insertId;

		// Insert data into customer_info table
		const query2 =
			"INSERT INTO customer_info (customer_id, customer_first_name, customer_last_name, active_customer_status) VALUES (?, ?, ?, ?)";
		const rows2 = await conn.query(query2, [
			customer_id,
			customer.customer_first_name,
			customer.customer_last_name,
			1,
		]);

		// Insert data into customer_vehicle_info table (if needed)
		// Modify this part based on your specific requirements

		// Construct the customer object to return
		const createdCustomer = {
			customer_id: customer_id,
		};

		return createdCustomer;
	} catch (err) {
		console.log(err.message);
		return false;
	}
}

// A function to get a customer by email
async function getCustomerByEmail(customer_email) {
	const query =
		"SELECT * FROM customer_identifier INNER JOIN customer_info ON customer_identifier.customer_id = customer_info.customer_id WHERE customer_identifier.customer_email = ?";
	const rows = await conn.query(query, [customer_email]);
	return rows;
}

async function getAllCustomers() {
	try {
		const query =
			" SELECT * FROM customer_identifier INNER JOIN customer_info  ON customer_identifier.customer_id = customer_info.customer_id ORDER BY customer_info.customer_id DESC";

		const rows = await conn.query(query);

		return rows;
	} catch (error) {
		console.error(error);
		return [];
	}
}
// A function to get a single customer by ID
async function getCustomerById(customer_id) {
	const query =
		"SELECT * FROM customer_identifier INNER JOIN customer_info ON customer_identifier.customer_id = customer_info.customer_id WHERE customer_identifier.customer_id = ?";
	const rows = await conn.query(query, [customer_id]);
	return rows[0]; // Assuming there is only one customer with a given ID
}

// A function to update a customer by ID
async function updateCustomer(customer_id, updatedData) {
	try {
		// Update data in customer_info table
		const query1 =
			"UPDATE customer_info SET customer_first_name = ?, customer_last_name = ?, active_customer_status = ? WHERE customer_id = ?";
		const rows1 = await conn.query(query1, [
			updatedData.customer_first_name,
			updatedData.customer_last_name,
			updatedData.active_customer_status,
			customer_id,
		]);
		const query2 =
			"UPDATE customer_identifier SET customer_phone_number = ?  WHERE customer_id = ?";
		const rows2 = await conn.query(query2, [
			updatedData.customer_phone_number,
			customer_id,
		]);

		if (rows1.affectedRows !== 1 || rows2.affectedRows !== 1) {
			return false;
		}

		// Construct the updated customer object to return
		const updatedCustomer = {
			customer_id: customer_id,
			...updatedData,
		};

		return updatedCustomer;
	} catch (err) {
		console.log(err.message);
		return false;
	}
}

// Export the functions for use in the controller
module.exports = {
	checkIfCustomerExists,
	createCustomer,
	getCustomerByEmail,
	getAllCustomers,
	getCustomerById,
	updateCustomer,
};
