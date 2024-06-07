import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { format } from "date-fns";
import orderService from "../../../../../services/order.service";
import customerService from "../../../../../services/customer.service";
import { useAuth } from "../../../../../Contexts/AuthContext";
import vehicleService from "../../../../../services/vehicle.service";
import employeeService from "../../../../../services/employee.service";
import { FaEdit } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faSearch,
	faAngleDoubleLeft,
	faAngleLeft,
	faAngleRight,
	faAngleDoubleRight,
} from "@fortawesome/free-solid-svg-icons";
function OrdersList() {
	const [orders, setOrders] = useState([]);
	const [apiError, setApiError] = useState(false);
	const [apiErrorMessage, setApiErrorMessage] = useState(null);
	const [customers, setCustomers] = useState({});
	const [vehicles, setVehicles] = useState({});
	const [employees, setEmployees] = useState({});
	const { employee, isAdmin } = useAuth();
	const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
	// for pagination
	const pageSize = 5; // Set the desired number of records per page
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	useEffect(() => {
		let token = null;
		if (employee) {
			token = employee.employee_token;
		}

		const fetchOrders = async () => {
			try {
				const response = await orderService.getAllOrders(token);
				if (!response.ok) {
					// console.log(response.status);
					setApiError(true);
					if (response.status === 401) {
						setApiErrorMessage("Please login again");
					} else if (response.status === 403) {
						setApiErrorMessage("You are not authorized to view this page");
					} else {
						setApiErrorMessage("Please try again later");
					}
				} else {
					const data = await response.json();
					if (data.length !== 0) {
						setTotalPages(Math.ceil(data.length / pageSize));
						// Filter orders based on pagination
						const start = (currentPage - 1) * pageSize;
						const end = start + pageSize;
						const paginatedOrders = data.slice(start, end);
						setOrders(paginatedOrders);
						await fetchCustomers(data);
						await fetchVehicles(data);
						await fetchEmployees(data);
					}
				}
			} catch (error) {
				console.log(error);
			}
		};
		// fetch customer based on customer id
		const fetchCustomers = async (orders) => {
			try {
				const customerIds = orders.map((order) => order.customer_id);
				// console.log("customer ids:", customerIds);
				const responses = await Promise.all(
					customerIds.map((customerId) =>
						customerService.getCustomer(token, customerId)
					)
				);
				// console.log("responses from get customer:", responses);

				const customersData = await Promise.all(
					responses.map((response) => response.json())
				);
				// console.log("customersData with json:", customersData);
				const customersMap = {};
				customersData.forEach((customerData) => {
					const customer = {
						name:
							customerData.customer_first_name +
							" " +
							customerData.customer_last_name,
						email: customerData.customer_email,
						phone: customerData.customer_phone_number,
					};
					// console.log("customer from forEach:", customer);
					customersMap[customerData.customer_id] = customer;
					// console.log("customer from customersMap for each:", customersMap);
				});
				// console.log("customer from customersMap for all:", customersMap);
				setCustomers(customersMap);
			} catch (error) {
				console.log(error);
			}
		};

		// fetch vehicle based on vehicle id
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
				// console.log("vehiclesData with json:", vehiclesData);
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
						employeeService.getEmployee(token, employeeId)
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

		fetchOrders();
	}, [currentPage]);
	// pagination clicks
	const handleFirstClick = () => {
		setCurrentPage(1);
	};

	const handlePreviousClick = () => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1);
		}
	};

	const handleNextClick = () => {
		if (currentPage < totalPages) {
			setCurrentPage(currentPage + 1);
		}
	};

	const handleLastClick = () => {
		setCurrentPage(totalPages);
	};
	// handling responsiveness

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 768);
		};

		window.addEventListener("resize", handleResize);
		// handleResize();

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return (
		<>
			{apiError ? (
				<section className="contact-section">
					<div className="auto-container">
						<div className="contact-title">
							<h2>{apiErrorMessage}</h2>
						</div>
					</div>
				</section>
			) : (
				<section className="contact-section">
					<div className="auto-container">
						<div className="contact-title">
							<h2>Orders</h2>
						</div>
						{isMobile ? (
							<Table striped bordered hover>
								<thead>
									<tr>
										<th>Order Id</th>
										<th>Customer</th>
										<th>Order Status</th>
										<th>Edit/View</th>
									</tr>
								</thead>
								<tbody>
									{orders.map((order) => (
										<tr key={order.order_id}>
											<td className="order-text1">{order.order_id}</td>
											<td>
												<span className="order-text1 pr-2">
													{customers[order.customer_id]?.name}
												</span>
												<br />
												{/* {customers[order.customer_id]?.email} <br /> */}
												{/* {customers[order.customer_id]?.phone} */}
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
												<div className="edit-delete-icons">
													<Link
														to={
															isAdmin
																? `/admin/order/${order.order_id}/edit`
																: ""
														}
													>
														<FaEdit />
													</Link>

													<Link to={`/order-details/${order.order_hash}`}>
														<FiExternalLink />
													</Link>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</Table>
						) : (
							<Table striped bordered hover>
								<thead>
									<tr>
										<th>Order Id</th>
										<th>Customer</th>
										<th>Vehicle</th>
										<th>Order Date</th>
										{isAdmin && <th>Received By</th>}

										<th>Order Status</th>
										<th>Active Order</th>
										<th>Edit/View</th>
									</tr>
								</thead>
								<tbody>
									{orders.map((order) => (
										<tr key={order.order_id}>
											<td className="order-text1">{order.order_id}</td>
											<td>
												<span className="order-text1">
													{customers[order.customer_id]?.name}
												</span>
												<br />
												{customers[order.customer_id]?.email} <br />
												{customers[order.customer_id]?.phone}
											</td>
											<td>
												<span className="order-text1">
													{vehicles[order.vehicle_id]?.vehicleName}
												</span>
												<br />
												{vehicles[order.vehicle_id]?.year} <br />
												{vehicles[order.vehicle_id]?.vehicleTag}
											</td>
											<td>
												{format(new Date(order.order_date), "MM / dd / yyyy ")}
											</td>
											{isAdmin && (
												<td>
													<span className="order-text1">
														{employees[order.employee_id]?.employeeName}
													</span>
												</td>
											)}

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
													{order.active_order === 0 ? "No " : "Yes"}
												</span>
											</td>
											<td>
												<div className="edit-delete-icons">
													<Link
														to={
															isAdmin
																? `/admin/order/${order.order_id}/edit`
																: ""
														}
													>
														<FaEdit />
													</Link>
													|
													<Link to={`/order-details/${order.order_hash}`}>
														<FiExternalLink />
													</Link>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</Table>
						)}
					</div>
					<div
						style={{
							display: "flex",
							justifyContent: "center",
							marginBottom: "20px",
							alignItems: "center", // Centering vertically
						}}
					>
						<button
							onClick={handleFirstClick}
							disabled={currentPage === 1}
							style={{ marginRight: "10px" }}
						>
							<FontAwesomeIcon icon={faAngleDoubleLeft} /> First
						</button>
						<button
							onClick={handlePreviousClick}
							disabled={currentPage === 1}
							style={{ marginRight: "10px" }}
						>
							<FontAwesomeIcon icon={faAngleLeft} /> Previous
						</button>
						<span style={{ margin: "0 10px" }}>
							Page {currentPage} of {totalPages}
						</span>
						<button
							onClick={handleNextClick}
							disabled={currentPage === totalPages}
							style={{
								// backgroundColor: "black",
								// color: "white",
								marginRight: "10px",
							}}
						>
							Next <FontAwesomeIcon icon={faAngleRight} />
						</button>
						<button
							onClick={handleLastClick}
							disabled={currentPage === totalPages}
							// style={{ backgroundColor: "black", color: "white" }}
						>
							Last <FontAwesomeIcon icon={faAngleDoubleRight} />
						</button>
					</div>
				</section>
			)}
		</>
	);
}

export default OrdersList;
