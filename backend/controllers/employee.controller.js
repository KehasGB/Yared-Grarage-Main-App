// Import the employee service
const employeeService = require("../services/employee.service");
// Create the add employee controller
async function createEmployee(req, res, next) {
	// Check if employee email already exists in the database
	const employeeExists = await employeeService.checkIfEmployeeExists(
		req.body.employee_email
	);
	// If employee exists, send a response to the client
	if (employeeExists) {
		res.status(400).json({
			error: "This email address is already associated with another employee!",
		});
	} else {
		try {
			// Validate request body
			const errors = validateCreateEmployee(req.body);

			if (errors) {
				return res.status(400).json({ errors });
			}
			const employeeData = req.body;
			// Create the employee
			const employee = await employeeService.createEmployee(employeeData);
			if (!employee) {
				// console.log(employee);
				res.status(400).json({
					error: "Failed to add the employee!",
				});
			} else {
				res.status(200).json({
					status: "true",
				});
			}
		} catch (error) {
			console.log(err);
			res.status(400).json({
				error: "Something went wrong!",
			});
		}
	}
}

// Create the getAllEmployees controller
async function getAllEmployees(req, res, next) {
	// Call the getAllEmployees method from the employee service
	const employees = await employeeService.getAllEmployees();
	// console.log(employees);
	if (!employees) {
		res.status(400).json({
			error: "Failed to get all employees!",
		});
	} else {
		res.status(200).json({
			status: "success",
			data: employees,
		});
	}
}

// Create the getSingleEmployee controller
async function getSingleEmployee(req, res, next) {
	const employeeId = req.params.id;
	// Call the getSingleEmployee method from the employee service
	const employee = await employeeService.getSingleEmployee(employeeId);
	// console.log(employees);
	if (!employee) {
		res.status(400).json({
			error: "Failed to get single employee!",
		});
	} else {
		res.status(200).json(
			
			employee,
		);
	}
}
// Create the updateEmployee controller
const updateEmployee = async (req, res) => {
	try {
		const EmployeeId = req.params.id;
		const updatedEmployee = await employeeService.updateEmployee(
			EmployeeId,
			req.body
		);

		if (!updatedEmployee) {
			return res.status(404).json({
				error: "Employee not exist",
			});
		}

		res.status(200).json({
			status: "true",
			Employee: updatedEmployee,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			error: "Internal Server Error",
		});
	}
};

// Employee validation function for createEmployee

const validateCreateEmployee = (employeeData) => {
	const errors = [];

	// Add your validation logic here
	if (
		!employeeData.employee_email ||
		!isValidEmail(employeeData.employee_email)
	) {
		errors.push({ param: "employee_email", msg: "Invalid email address" });
	}

	// Add more validation checks as needed

	return errors.length > 0 ? errors : null;
};

// Employee validation function for email format
const isValidEmail = (email) => {
	// Implement your email validation logic
	// For simplicity, a basic check is shown here
	return /\S+@\S+\.\S+/.test(email);
};
// Export the createEmployee controller
module.exports = {
	createEmployee,
	getAllEmployees,
	getSingleEmployee,
	updateEmployee,
};
