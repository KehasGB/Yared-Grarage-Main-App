import React, { useEffect, useState } from "react";
import { FaEdit, FaHandPointer, FaWindowClose } from "react-icons/fa";
import { Link } from "react-router-dom";
import Table from "react-bootstrap/Table";
import { FiExternalLink } from "react-icons/fi";
import { useLocation, useParams } from "react-router";
import { useAuth } from "../../../../Contexts/AuthContext";
import customerServices from "../../../../services/customer.service";
import vehicleService from "../../../../services/vehicle.service";
import orderService from "../../../../services/order.service";
import AddVehicleForm from "../AddVehicleForm/AddVehicleForm";
import employeeService from "../../../../services/employee.service";
import { format } from "date-fns";

const CustomerProfileForm = () => {
	const location = useLocation();
	const [customer, setCustomer] = useState(null);
	const [vehicles, setVehicles] = useState([]);
	const [orders, setOrders] = useState([]);
	const [customerVehicles, setCustomerVehicle] = useState([]);
	const { customer_id } = useParams();
	const [employees, setEmployees] = useState({});
	const [selectCustomer, setSelectCustomer] = useState({
		customer_first_name: "",
		customer_last_name: "",
		customer_email: "",
		customer_phone_number: "",
		active_customer_status: "",
	});

	const [showAddVehicleForm, setShowAddVehicleForm] = useState(false);
	// console.log(showAddVehicleForm);
	let loggedInEmployeeToken = "";
	const { employee } = useAuth();
	if (employee && employee.employee_token) {
		loggedInEmployeeToken = employee.employee_token;
	}
	// toggling add  vehicle form
	const handleToggleAddVehicleForm = () => {
		setShowAddVehicleForm(!showAddVehicleForm);
		// console.log("object");
	};
	const closeInfo = () => {
		setIsCustomerSelected(false);
		window.location.reload();
	};
	useEffect(() => {
		// Log the customer_id value
		// console.log("customer_id in CustomerProfileForm:", customer_id);

		// Fetch customer
		customerServices
			.getCustomer(loggedInEmployeeToken, customer_id)
			.then((res) => res.json())
			.then((response) => {
				// console.log(response);
				setCustomer(response);
			})
			.catch((error) => {
				console.error("Error fetching customer:", error);
			});

		// // Fetch vehicles
		// vehicleService
		// 	.getVehiclesPerCustomer(customer_id)
		// 	.then((res) => res.json())
		// 	.then((response) => {
		// 		setVehicles(response);
		// 	})
		// 	.catch((error) => {
		// 		console.error("Error fetching vehicles:", error);
		// 	});

		// Fetch orders
		orderService
			.getOrdersByCustomerId(loggedInEmployeeToken, customer_id)
			.then((res) => res.json())
			.then((response) => {
				console.log("Response from orders API:", response);
				setOrders(response);
				fetchVehicles(response);
				fetchEmployees(response);
			})
			.catch((error) => {
				console.log("Error fetching orders:", error);
			});
	}, [customer_id]);
	const fetchVehicles = async (orders) => {
		try {
			// get vehicle ids
			const vehicleIds = orders.map((order) => order.vehicle_id);
			// console.log("vehicle ids:", vehicleIds);

			// fetch vehicle info based on vehicle ids
			const responses = await Promise.all(
				vehicleIds.map((vehicleId) =>
					vehicleService.getSingleVehicleById(vehicleId)
				)
			);
			// console.log("responses from get vehicle:", responses);

			const vehiclesData = await Promise.all(
				responses.map((response) => response.json())
			);
			setCustomerVehicle(vehiclesData);

			console.log("vehiclesData with json:", vehiclesData);
			// map vehicle info the way we want
			const vehiclesMap = {};
			vehiclesData.forEach((vehicleData) => {
				const vehicle = {
					vehicleName:
						vehicleData.vehicle_make + " " + vehicleData.vehicle_model,
					year: vehicleData.vehicle_year,
					vehicleTag: vehicleData.vehicle_tag,
				};
				// console.log("vehicle from forEach:", vehicle);
				vehiclesMap[vehicleData.vehicle_id] = vehicle;
				// console.log("vehicle from vehiclesMap for each:", vehiclesMap);
			});
			// console.log("vehicles from vehiclesMap for all:", vehiclesMap);
			setVehicles(vehiclesMap);
		} catch (error) {
			console.log(error);
		}
	};
	// fetch employee based on employee id to see who added the order
	const fetchEmployees = async (orders) => {
		try {
			// get employee ids
			const employeeIds = orders.map((order) => order.employee_id);
			// console.log("employee ids:", employeeIds);

			// fetch employee info based on employee ids
			const responses = await Promise.all(
				employeeIds.map((employeeId) =>
					employeeService.getEmployee(loggedInEmployeeToken, employeeId)
				)
			);
			// console.log("responses from get employee:", responses);

			const employeesData = await Promise.all(
				responses.map((response) => response.json())
			);
			// console.log("employeesData with json:", employeesData);
			// map employee info the way we want
			const employeesMap = {};
			employeesData.forEach((employeeData) => {
				const employee = {
					employeeName:
						employeeData.employee_first_name +
						" " +
						employeeData.employee_last_name,
				};
				// console.log("employee from forEach:", employee);
				employeesMap[employeeData.employee_id] = employee;
				// console.log("employee from employeesMap for each:", employeesMap);
			});
			// console.log("employees from employeesMap for all:", employeesMap);
			setEmployees(employeesMap);
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<section className="history-section">
			<div className="auto-container">
				<div className="history-block">
					<div className="years">info</div>

					<div className="wrapper-box selected-customer">
						<div className="left-column text">
							<h2 className="order-text1">
								Customer:{" "}
								{customer?.customer_first_name +
									" " +
									customer?.customer_last_name}
								<br />
							</h2>
							<span className="order-text2">Email</span>:{" "}
							{customer?.customer_email}
							<br />
							<span className="order-text2">Phone Number</span>:
							{customer?.customer_phone_number} <br />
							<span className="order-text2">Active Customer</span>:
							{customer?.active_customer_status == 1 ? " Yes" : " No"} <br />
							<span className="order-text2">
								Edit customer info_
								<Link to={`/admin/customer/edit/${customer_id}`}>
									<FaEdit />
								</Link>
							</span>
						</div>
					</div>
				</div>
				<div className="history-block">
					<div className="years">cars</div>
					<div className="content">
						<h2>Vehicles of {customer?.customer_first_name || "N/A"}</h2>
						<div className="contact-form">
							{customerVehicles && customerVehicles.length > 0 ? (
								<Table striped bordered hover>
									<thead>
										<tr>
											<th>Year</th>
											<th>Make</th>
											<th>Model</th>
											<th>Tag</th>
											<th>Serial</th>
											<th>Color</th>
											<th>Mileage</th>
										</tr>
									</thead>
									<tbody>
										{customerVehicles.map((vehicle) => (
											<tr key={vehicle.vehicle_id}>
												<td>{vehicle.vehicle_year}</td>
												<td>{vehicle.vehicle_make}</td>
												<td>{vehicle.vehicle_model}</td>
												<td>{vehicle.vehicle_tag}</td>
												<td>{vehicle.vehicle_serial}</td>
												<td>{vehicle.vehicle_color}</td>
												<td>{vehicle.vehicle_mileage}</td>
											</tr>
										))}
									</tbody>
								</Table>
							) : (
								<div className="wrapper-box selected-customer">
									<div className="left-column text">
										<div colSpan="8">No vehicles found for this customer.</div>
									</div>
								</div>
							)}
							{!showAddVehicleForm ? (
								<div className="form-group col-md-12">
									<button
										className="theme-btn btn-style-one"
										type="submit"
										data-loading-text="Please wait..."
									>
										<span onClick={handleToggleAddVehicleForm}>
											Add New vehicle
										</span>
									</button>
								</div>
							) : (
								<div className="add-vehicle-form">
									<div className="wrapper-box selected-customer col-md-10">
										<div className="form-close">
											<Link onClick={handleToggleAddVehicleForm}>
												<FaWindowClose />
											</Link>
										</div>
										<div className="left-column ">
											<div>
												<AddVehicleForm toggle={handleToggleAddVehicleForm} />
											</div>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>

				<div className="history-block">
					<div className="years">orders</div>
					<div className="content">
						<h2>Orders of {customer?.customer_first_name || "N/A"}</h2>
						<div className="contact-form">
							<Table striped bordered hover>
								<thead>
									<tr>
										<th>Order Id</th>
										<th>Vehicle</th>
										<th>Order Date</th>
										<th>Received By</th>
										<th>Order Status</th>
										<th>Active Order</th>
										<th>Edit/View</th>
									</tr>
								</thead>

								<tbody>
									{orders && orders.length > 0 ? (
										orders.map((order) => (
											<tr key={order.order_id}>
												<td className="order-text1">{order.order_id}</td>

												<td>
													{vehicles[order.vehicle_id]?.vehicleName && (
														<div>
															<span className="order-text1">
																{vehicles[order.vehicle_id]?.vehicleName}{" "}
															</span>
															<br />
															{vehicles[order.vehicle_id]?.year} <br />
															{vehicles[order.vehicle_id]?.vehicleTag}
														</div>
													)}
												</td>
												<td>
													{format(
														new Date(order.order_date),
														"MM / dd / yyyy "
													)}
												</td>
												<td>
													<span className="order-text1">
														{employees[order.employee_id]?.employeeName}
													</span>
												</td>
												<td>
													<span
														className={
															order.order_status === 0
																? "order-status-inprogress"
																: "order-status-done"
														}
													>
														{order.order_status === 0
															? "In Progress"
															: "Completed"}
													</span>
												</td>
												<td>
													<span
														className={
															order.active_order === 0
																? "order-status-inprogress"
																: "order-status-done"
														}
													>
														{order.active_order === 0 ? "No" : "Yes"}
													</span>
												</td>
												<td>
													<div className="edit-delete-icons">
														<Link to={`/admin/order/${order.order_id}/edit`}>
															<FaEdit />
														</Link>
														|
														<Link to={`/order/${order.order_hash}`}>
															<FiExternalLink />
														</Link>
													</div>
												</td>
											</tr>
										))
									) : (
										<tr>
											<td colSpan="8">
												{orders === null
													? "Loading orders..."
													: "No orders found for this customer."}
												<div></div>
											</td>
										</tr>
									)}
								</tbody>
							</Table>
						</div>

						<Link to="/admin/order" className="form-group col-md-12">
							<button
								className="theme-btn btn-style-one"
								type="submit"
								data-loading-text="Please wait..."
							>
								<span>Add New Order</span>
							</button>
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
};

export default CustomerProfileForm;
