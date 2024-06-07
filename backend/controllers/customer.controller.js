const customerService = require("../services/customer.service");
const uuid = require("uuid");
const getAllCustomers = async (req, res) => {
	try {
		const customers = await customerService.getAllCustomers();
		res.status(200).json({
			customers,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			error: "Internal Server Error",
		});
	}
};

const getSingleCustomer = async (req, res) => {
	try {
		const customerId = req.params.id;
		const customer = await customerService.getCustomerById(customerId);

		if (!customer) {
			return res.status(404).json({
				error: "Customer not found",
			});
		}

		res.status(200).json(
			customer,
		);
	} catch (error) {
		console.error(error);
		res.status(500).json({
			error: "Internal Server Error",
		});
	}
};

const createCustomer = async (req, res) => {
	try {
		// Validate request body
		const errors = validateCreateCustomer(req.body);

		if (errors) {
			return res.status(400).json({ errors });
		}

		// Check if customer email already exists in the database
		const customerExists = await customerService.checkIfCustomerExists(
			req.body.customer_email
		);

		// If customer exists, send a response to the client
		if (customerExists) {
			return res.status(400).json({
				error:
					"This email address is already associated with another customer!",
			});
		}

		// Create the customer with a generated UUID
		const generatedUuid = uuid.v4();
		// console.log("Generated UUID:", generatedUuid);

		const customerData = {
			...req.body,
			customer_hash: generatedUuid, // Use the generated UUID
		};

		const customer = await customerService.createCustomer(customerData);

		if (!customer) {
			return res.status(400).json({
				error: "Failed to add the customer!",
			});
		}

		res.status(201).json({
			status: "true",
			customer: customer,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			error: "Internal Server Error",
		});
	}
};

const updateCustomer = async (req, res) => {
	try {
		const customerId = req.params.id;
		const updatedCustomer = await customerService.updateCustomer(
			customerId,
			req.body
		);

		if (!updatedCustomer) {
			return res.status(404).json({
				error: "Customer not found",
			});
		}

		res.status(200).json({
			status: "true",
			customer: updatedCustomer,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			error: "Internal Server Error",
		});
	}
};

// Custom validation function for createCustomer

const validateCreateCustomer = (customerData) => {
	const errors = [];

	// Add your validation logic here
	if (
		!customerData.customer_email ||
		!isValidEmail(customerData.customer_email)
	) {
		errors.push({ param: "customer_email", msg: "Invalid email address" });
	}

	// Add more validation checks as needed

	return errors.length > 0 ? errors : null;
};

// Custom validation function for email format
const isValidEmail = (email) => {
	// Implement your email validation logic
	// For simplicity, a basic check is shown here
	return /\S+@\S+\.\S+/.test(email);
};

module.exports = {
	getAllCustomers,
	getSingleCustomer,
	createCustomer,
	updateCustomer,
};
