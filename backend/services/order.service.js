// Import the query function from the db.config.js file
const conn = require("../config/db.config");
// import uuid and crypto module to have an order hashed id
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
// A function to check if customer exists in the database
async function checkIfCustomerExists(customer_id) {
	const query = "SELECT * FROM customer_identifier WHERE customer_id = ? ";
	const rows = await conn.query(query, [customer_id]);
	// console.log(rows);
	if (rows.length > 0) {
		return true;
	}
	return false;
}

// A function to add a new order
async function createOrder(order) {
	let createdOrder = "";
	console.log("coming order:", order);
	try {
		// generating a random order hashed id
		function generateRandomOrderHashedId() {
			const randomBytes = crypto.randomBytes(16);
			const uuid = uuidv4({ random: randomBytes });
			return uuid;
		}
		const orderHashedId = generateRandomOrderHashedId();
		// console.log(orderHashedId);
		// order body validation
		if (!order.employee_id || !order.customer_id || !order.vehicle_id) {
			throw new Error("Missing data in request body!");
		}
		// query for Inserting the employee_id,customer_id, vehicle_id, active_order and order_hash in to the orders table
		const query = `INSERT INTO orders (employee_id,customer_id, vehicle_id, active_order,order_hash)  VALUES (?,?,?,?,?)`;
		const rows = await conn.query(query, [
			order.employee_id,
			order.customer_id,
			order.vehicle_id,
			1,
			orderHashedId,
		]);
		// console.log(rows);
		if (rows.affectedRows !== 1) {
			return false;
		}

		// Get the order id from the insert
		const order_id = rows.insertId;

		// Insert the remaining data in to the order_info, order_services, order_status  tables
		const query2 = `
  INSERT INTO order_info (
    order_id, 
    order_total_price,
    estimated_completion_date, 
 	completion_date,
    additional_request,
    notes_for_internal_use,
    notes_for_customer,
    additional_requests_completed
  ) 
  VALUES (?, ?, STR_TO_DATE(?, '%Y-%m-%dT%H:%i:%s.%fZ'), 
				STR_TO_DATE(?, "%Y-%m-%dT%H:%i:%s.%fZ"),
    ?,
    ?,
    ?,
    ?
  )
`;

		const queryParams = [
			order_id,
			order.order_total_price,
			order.estimated_completion_date,
			null,
			order.additional_request,
			order.order_description,
			"",
			0,
		];

		// Ensure the number of placeholders matches the length of queryParams
		if (query2.match(/\?/g).length !== queryParams.length) {
			console.error("Error: Column count doesn't match value count");
			return;
		} else {
			// Continue with your database query execution
			const rows2 = await conn.query(query2, queryParams);
			// console.log("rows2 result:", rows2);
			if (rows2.affectedRows !== 1) {
				return false;
			}
		}

		const query3 = `INSERT INTO order_services (order_id, service_id, service_completed)  VALUES (?, ?, ?)`;

		for (let i = 0; i < order.order_services.length; i++) {
			const service = order.order_services[i];
			const rows3 = await conn.query(query3, [order_id, service.service_id, 0]);
			// console.log("rows3 result:", rows3);
			if (rows3.affectedRows !== 1) {
				return false;
			}
		}

		const query4 = `INSERT INTO order_status (order_id, order_status)  VALUES (?, ?)`;
		const rows4 = await conn.query(query4, [order_id, 0]);
		// console.log("rows4 result:", rows4);
		if (rows4.affectedRows !== 1) {
			return false;
		}
		createdOrder = { order_id: order_id };
	} catch (error) {
		console.log(error);
	}
	return createdOrder;
}

// async function to getAllOrders
async function getAllOrders() {
	try {
		// get all orders query
		const query = `SELECT
  o.order_id,
  o.employee_id,
  o.customer_id,
  o.vehicle_id,
  o.order_date,
  o.active_order,
  o.order_hash,
  oi.order_info_id,
  oi.order_total_price,
  oi.estimated_completion_date,
  oi.completion_date,
  oi.additional_request,
  oi.notes_for_internal_use,
  oi.notes_for_customer,
  oi.additional_requests_completed,
  os.order_services,
  ost.order_status_id,
  ost.order_status
FROM
  orders o
JOIN
  order_info oi ON o.order_id = oi.order_id
LEFT JOIN
  (
    SELECT
      order_id,
      JSON_ARRAYAGG(
        JSON_OBJECT(
          'order_service_id', order_service_id,
          'service_id', service_id,
          'service_completed', service_completed
        )
      ) AS order_services
    FROM
      order_services
    GROUP BY
      order_id
  ) os ON o.order_id = os.order_id
LEFT JOIN
  order_status ost ON o.order_id = ost.order_id
ORDER BY
  o.order_id DESC;

`;
		const rows = await conn.query(query);
		return rows;
	} catch (error) {
		console.log(error.message);
		return false;
	}
}

// async function to getOrderById
async function getOrderById(order_id) {
	try {
		// get all orders query
		const query = `SELECT
  o.order_id,
  o.employee_id,
  o.customer_id,
  o.vehicle_id,
  o.order_date,
  o.active_order,
  o.order_hash,
  oi.order_info_id,
  oi.order_total_price,
  oi.estimated_completion_date,
  oi.completion_date,
  oi.additional_request,
  oi.notes_for_internal_use,
  oi.notes_for_customer,
  oi.additional_requests_completed,
  os.order_services,
  ost.order_status_id,
  ost.order_status
FROM
  orders o
JOIN
  order_info oi ON o.order_id = oi.order_id
LEFT JOIN
  (
    SELECT
      order_id,
      JSON_ARRAYAGG(
        JSON_OBJECT(
          'order_service_id', order_service_id,
          'service_id', service_id,
          'service_completed', service_completed
        )
      ) AS order_services
    FROM
      order_services
    GROUP BY
      order_id
  ) os ON o.order_id = os.order_id
LEFT JOIN
  order_status ost ON o.order_id = ost.order_id
WHERE
  o.order_id = ?;

`;
		const rows = await conn.query(query, [order_id]);
		return rows[0];
	} catch (error) {
		console.log(error.message);
		return false;
	}
}

// async function to getOrdersByCustomerId
async function getOrdersByCustomerId(customer_id) {
	try {
		// get all orders query
		const query = `SELECT
  o.order_id,
  o.employee_id,
  o.customer_id,
  o.vehicle_id,
  o.order_date,
  o.active_order,
  o.order_hash,
  oi.order_info_id,
  oi.order_total_price,
  oi.estimated_completion_date,
  oi.completion_date,
  oi.additional_request,
  oi.notes_for_internal_use,
  oi.notes_for_customer,
  oi.additional_requests_completed,
  os.order_services,
  ost.order_status_id,
  ost.order_status
FROM
  orders o
JOIN
  order_info oi ON o.order_id = oi.order_id
LEFT JOIN
  (
    SELECT
      order_id,
      JSON_ARRAYAGG(
        JSON_OBJECT(
          'order_service_id', order_service_id,
          'service_id', service_id,
          'service_completed', service_completed
        )
      ) AS order_services
    FROM
      order_services
    GROUP BY
      order_id
  ) os ON o.order_id = os.order_id
LEFT JOIN
  order_status ost ON o.order_id = ost.order_id
WHERE
  o.customer_id = ?;

`;
		const rows = await conn.query(query, [customer_id]);
		return rows;
	} catch (error) {
		console.log(error.message);
		return false;
	}
}

// async function to updateOrder
async function updateOrder(order_id, order) {
	try {
		// update orders table -basicall to update if the order is actie or not

		const updateOrderQuery = `UPDATE orders SET active_order=?   
  WHERE
    orders.order_id = ?
`;
		const updateOrderParams = [order.active_order, order_id];
		const updateOrderResult = await conn.query(
			updateOrderQuery,
			updateOrderParams
		);
		if (updateOrderResult.affectedRows !== 1) {
			return false;
		}

		// Update order_info table
		const updateOrderInfoQuery = `UPDATE order_info SET order_total_price=?, 
    estimated_completion_date = STR_TO_DATE(?, '%Y-%m-%dT%H:%i:%s.%fZ'),
    completion_date = STR_TO_DATE(?, '%Y-%m-%dT%H:%i:%s.%fZ'),additional_requests_completed = ?
    
  WHERE
    order_info.order_id = ?
`;
		const updateOrderInfoParams = [
			order.order_total_price,
			order.estimated_completion_date,
			order.completion_date,
			order.additional_requests_completed,
			order_id,
		];
		const updateOrderInfoResult = await conn.query(
			updateOrderInfoQuery,
			updateOrderInfoParams
		);
		if (updateOrderInfoResult.affectedRows !== 1) {
			return false;
		}

		// update order_services table
		for (i = 0; i < order.order_services.length; i++) {
			const serviceRecord = order.order_services[i];
			const updateOrderServicesQuery = `UPDATE order_services    SET service_id = ?,service_completed=? WHERE order_services.order_id = ? AND order_service_id = ?
    `;

			const updateOrderServicesParams = [
				serviceRecord.service_id,
				serviceRecord.service_completed,
				order_id,
				serviceRecord.order_service_id,
			];

			const updateOrderServicesResult = await conn.query(
				updateOrderServicesQuery,
				updateOrderServicesParams
			);

			if (updateOrderServicesResult.affectedRows == 0) {
				console.log("Error updating order_services.");
				return false;
			}
		}

		// update order status table
		const updateOrderStatusQuery = `UPDATE order_status SET   order_status = ? WHERE order_status.order_id = ?`;

		const updateOrderStatusParams = [order.order_completed, order_id];
		const updateOrderStatusResult = await conn.query(
			updateOrderStatusQuery,
			updateOrderStatusParams
		);
		if (updateOrderStatusResult.affectedRows !== 1) {
			console.log("Error updating order_status.");
			return false;
		}
	} catch (error) {
		console.log(error.message);
		return false;
	}
}

async function getOrderByHash(order_hash) {
	try {
		// get all orders query
		const query = `SELECT
  o.order_id,
  o.employee_id,
  o.customer_id,
  o.vehicle_id,
  o.order_date,
  o.active_order,
  o.order_hash,
  oi.order_info_id,
  oi.order_total_price,
  oi.estimated_completion_date,
  oi.completion_date,
  oi.additional_request,
  oi.notes_for_internal_use,
  oi.notes_for_customer,
  oi.additional_requests_completed,
  os.order_services,
  ost.order_status_id,
  ost.order_status
FROM
  orders o
JOIN
  order_info oi ON o.order_id = oi.order_id
LEFT JOIN
  (
    SELECT
      order_id,
      JSON_ARRAYAGG(
        JSON_OBJECT(
          'order_service_id', order_service_id,
          'service_id', service_id,
          'service_completed', service_completed
        )
      ) AS order_services
    FROM
      order_services
    GROUP BY
      order_id
  ) os ON o.order_id = os.order_id
LEFT JOIN
  order_status ost ON o.order_id = ost.order_id
WHERE
  o.order_hash = ?;

`;
		const rows = await conn.query(query, [order_hash]);
		return rows[0];
	} catch (error) {
		console.log(error.message);
		return false;
	}
}

// Export the functions for use in the controller
module.exports = {
	createOrder,
	checkIfCustomerExists,
	getAllOrders,
	getOrderById,
	updateOrder,
	getOrdersByCustomerId,
	getOrderByHash,
};
