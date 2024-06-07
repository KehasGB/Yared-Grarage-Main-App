// Import from the env
const api_url = import.meta.env.VITE_REACT_APP_API_URL;

// A function to send post request to create a new employee
const createEmployee = async (formData, loggedInEmployeeToken) => {
	const requestOptions = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"x-access-token": loggedInEmployeeToken,
		},
		body: JSON.stringify(formData),
	};
	console.log(requestOptions);
	const response = await fetch(`${api_url}/api/employee`, requestOptions);
	return response;
};

// A function to send get request to get all employees
const getAllEmployees = async (token) => {
	// console.log(token);
	const requestOptions = {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			"x-access-token": token,
		},
	};
	const response = await fetch(`${api_url}/api/employees`, requestOptions);
	return response;
};

// A function to send get request to get employee
const getEmployee = async (token,employee_id) => {
	// console.log(token);
	const requestOptions = {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			"x-access-token": token,
		},
	};
	try {
		const response = await fetch(
		`${api_url}/api/employee/${employee_id}`,
		requestOptions
	);
	// console.log('employee: response==',response);
	return response;
	} catch (error) {
		console.error("Error fetching employee:", error);
		throw error;
	}
	
};

// Afunction to send put request to update employee data
const updateEmployee = async (employeeId, formData, loggedInEmployeeToken) => {
	const requestOptions = {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			"x-access-token": loggedInEmployeeToken,
		},
		body: JSON.stringify(formData),
	};

	const response = await fetch(
		`${api_url}/api/employee/${employeeId}`,
		requestOptions
	);
	return response;
};

// Export all the functions
const employeeService = {
	createEmployee,
	getAllEmployees,
	getEmployee,
	updateEmployee,
};
export default employeeService;
