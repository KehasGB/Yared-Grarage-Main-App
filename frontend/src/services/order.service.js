// Import from the env
const api_url = import.meta.env.VITE_REACT_APP_API_URL;
// A function to send get request to get all orders
const getAllOrders = async (token) => {
	// console.log(token);
	const requestOptions = {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			// "x-access-token": token,
		},
	};
	const response = await fetch(`${api_url}/api/orders`, requestOptions);
	return response;
};

// A function to send get request to get single order by order_id
const singleOrder = async (token,order_id) => {
	// console.log(token);
	try {
		const requestOptions = {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			"x-access-token": token,
		},
		};
	
		const response = await fetch(`${api_url}/api/order/${order_id}`, requestOptions);
				
		return response
	} catch (error) {
		console.log(error);
	}
	
};

// A function to send get request to get orders by customer_id
const getOrdersByCustomerId = async (token, customer_id) => {
	// console.log(token);
	try {
		const requestOptions = {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"x-access-token": token,
			},
		};

		const response = await fetch(
			`${api_url}/api/customer-orders/${customer_id}`,
			requestOptions
		);

		return response;
	} catch (error) {
		console.log(error);
	}
};

// A function to send get request to add an order
const addOrder = async (formData) => {
	const requestOptions = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			// "x-access-token": token,
		},
		body: JSON.stringify(formData),
	};
	const response = await fetch(`${api_url}/api/order`, requestOptions);
	return response;
};

// a function to send a put request to update an order
const updateOrder = async (token, id, orderData) => {
	const requestOptions = {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			"x-access-token": token,
		},
		body: JSON.stringify(orderData),
	};
	const response = await fetch(`${api_url}/api/order/${id}`, requestOptions);
	return response;
};

// A function to send get request to get single order by order_hash
const getOrderHash = async (order_hash) => {
	// console.log(token);
	try {
		const requestOptions = {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			
		},
		};
	
		const response = await fetch(`${api_url}/api/orderStatus/${order_hash}`, requestOptions);
				
		return response
	} catch (error) {
		console.log(error);
	}
	
};
const orderService = {
	getAllOrders,
	addOrder,
	singleOrder,
	updateOrder,
	getOrdersByCustomerId,
	getOrderHash,
};
// export this module
export default orderService;
