import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { FaHandPointer } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { FaWindowClose } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import serviceService from "../../../../../services/service.service";
import { useAuth } from "../../../../../Contexts/AuthContext";
import orderService from "../../../../../services/order.service";
function CustomerVehicle({ customer, vehicles }) {
	const navigate = useNavigate();
	const { isLogged, isAdmin, employee } = useAuth();
	const [isCustomerSelected, setIsCustomerSelected] = useState(true);
	const [isVehicleSelected, setIsVehicleSelected] = useState(false);
	const [selectedVehicle, setSelectedVehicle] = useState({});
	const [services, setServices] = useState([]);
	// get values form the form
	const [additionalRequest, setAdditionalRequest] = useState("");
	const [totalPrice, setTotalPrice] = useState();
	const [orderDescription, setOrderDescription] = useState("");
	const [selectedServices, setSelectedServices] = useState([]);

	// Errors
	const [success, setSuccess] = useState(false);
	const [serverError, setServerError] = useState("");

	// close button functionality
	const closeInfo = () => {
		setIsCustomerSelected(false);
		window.location.reload();
	};

	// choose vehicle function
	const chooseVehicle = (customer, vehicle) => {
		setIsVehicleSelected(true);
		setSelectedVehicle(vehicle);
	};
	// console.log('vehicle:',selectedVehicle);

	// a function to fetch services
	useEffect(() => {
		const services = async () => {
			const response = await serviceService.getAllServices();
			const jsonResponse = await response.json();

			setServices(jsonResponse.services);
		};
		services();
	}, []);
	// console.log("services:", services);

	// set additonal request
	const handleAdditionalRequest = (e) => {
		setAdditionalRequest(e.target.value);
	};
	// set order total price
	const handleTotalPrice = (e) => {
		setTotalPrice(e.target.value);
	};
	// set order total price
	const handleOrderDescription = (e) => {
		setOrderDescription(e.target.value);
	};
	// handle check box values
	const handleCheckboxChange = (serviceId) => {
		setSelectedServices((prevSelectedServices) => {
			// Check if the service is already selected
			const isServiceSelected = prevSelectedServices.includes(serviceId);

			if (isServiceSelected) {
				// If the service is already selected, remove it from the selected services
				return prevSelectedServices.filter((id) => id !== serviceId);
			} else {
				// If the service is not selected, add it to the selected services
				return [...prevSelectedServices, serviceId];
			}
		});
	};
	// console.log("selected services:", selectedServices);
	const formatSelectedServices = () => {
		return selectedServices.map((serviceId) => ({
			service_id: serviceId,
		}));
	};

	// handle submit order
	const handleSubmitOrder = (event) => {
		event.preventDefault();
		// console.log(employee);
		const employee_id = employee.employee_id;
		const customer_id = customer.customer_id;
		const vehicle_id = selectedVehicle.vehicle_id;

		const orderServices = formatSelectedServices();

		const formData = {
			employee_id: employee_id,
			customer_id: customer_id,
			vehicle_id: vehicle_id,
			order_description: orderDescription,
			estimated_completion_date: "2024-05-10T14:10:11.338Z",
			order_total_price: totalPrice,
			additional_request: additionalRequest,
			notes_for_customer: "Customer prefers contact by email",
			order_services: orderServices,
		};
		// call the orderService.addOrder method form order servie
		const addOrder = orderService.addOrder(formData);
		addOrder
			.then((response) => response.json())
			.then((data) => {
				// console.log(data);
				// If Error is returned from the API server, set the error message
				if (data.error) {
					setServerError(data.error);
				} else {
					// Handle successful response
					setSuccess(true);
					setServerError("");
					// Redirect to the employees page after 2 seconds
					// For now, just redirect to the home page
					setTimeout(() => {
						// window.location.href = '/admin/employees';
						navigate("/admin/orders");
					}, 1500);
				}
			})
			// Handle Catch
			.catch((error) => {
				const resMessage =
					(error.response &&
						error.response.data &&
						error.response.data.message) ||
					error.message ||
					error.toString();
				setServerError(resMessage);
			});
	};
	return (
		<>
			{isCustomerSelected && (
				<div className=" style-two">
					<div className="auto-container">
						<div className="wrapper-box selected-customer">
							<div className="left-column text">
								<h3 className="order-text1">
									{customer.customer_first_name +
										" " +
										customer.customer_last_name}
									<br />
								</h3>
								<span className="order-text2">Email</span>:{" "}
								{customer.customer_email}
								<br />
								<span className="order-text2">Phone Number</span>:
								{customer.customer_phone_number} <br />
								<span className="order-text2">Active Customer</span>:
								{customer.active_customer_status == 1 ? " Yes" : " No"} <br />
								<span className="order-text2">
									Edit customer info_
									<Link to="#">
										<FaEdit />
									</Link>
								</span>
							</div>
							<div className="close-icon">
								<Link to="" onClick={closeInfo}>
									<FaWindowClose />
								</Link>
							</div>
						</div>
						{!isVehicleSelected ? (
							<>
								<div className="wrapper-box mt-3 customer-info">
									<div className="left-column">
										<h6 className="order-text1 pt-3">Choose a vehicle</h6>
										<Table striped bordered hover>
											<thead>
												<tr>
													<th>Year</th>
													<th>Make</th>
													<th>Model</th>
													<th>Tag</th>
													<th>Serial</th>
													<th>Color</th>
													<th>Milage</th>
													<th>Choose</th>
												</tr>
											</thead>
											<tbody>
												{vehicles?.map((vehicle) => (
													<tr key={vehicle.vehicle_id}>
														<td>{vehicle.vehicle_year}</td>
														<td>{vehicle.vehicle_make}</td>
														<td>{vehicle.vehicle_model}</td>
														<td>{vehicle.vehicle_tag}</td>
														<td>{vehicle.vehicle_serial}</td>
														<td>{vehicle.vehicle_color}</td>
														<td>{vehicle.vehicle_mileage}</td>
														<td>
															<div className="edit-delete-icons">
																<Link
																	to="#"
																	onClick={() =>
																		chooseVehicle(customer, vehicle)
																	}
																>
																	<FaHandPointer />
																</Link>
															</div>
														</td>
													</tr>
												))}
											</tbody>
										</Table>
									</div>
								</div>
							</>
						) : (
							<>
								{/* vehicle info section */}
								<div className="wrapper-box selected-customer my-3">
									<div className="left-column text">
										<h6 className="order-text1">
											{selectedVehicle.vehicle_make +
												" " +
												selectedVehicle.vehicle_model}
											<br />
										</h6>
										<span className="order-text2">Vehicle color</span>:
										{selectedVehicle.vehicle_color}
										<br />
										<span className="order-text2">Vehicle tag</span>:
										{selectedVehicle.vehicle_tag} <br />
										<span className="order-text2">Vehicle year</span>:
										{selectedVehicle.vehicle_year} <br />
										<span className="order-text2">Vehicle milage</span>:
										{selectedVehicle.vehicle_mileage}
										<br />
										<span className="order-text2">Vehicle serial</span>:
										{selectedVehicle.vehicle_serial}
										<br />
										<span className="order-text2">
											Edit vehicle info_
											<Link to="#">
												<FaEdit />
											</Link>
										</span>
									</div>
									<div className="close-icon">
										<Link to="" onClick={closeInfo}>
											<FaWindowClose />
										</Link>
									</div>
								</div>

								{/* choose service section */}

								<div className="wrapper-box selected-customer">
									<div className="left-column">
										<h6 className="order-text1">Choose service</h6>
										{services?.map((service) => (
											<div
												className=" mt-2 px-3 service-item checkbox-holder"
												key={service.service_id}
											>
												<h5 className="order-text2">{service.service_name}</h5>
												<div className="row  ">
													<div className="col-11 ">
														{service.service_description}
													</div>
													<div className="col-1 ">
														<input
															type="checkbox"
															name={`service_${service.service_id}`}
															id={`service_${service.service_id}`}
															checked={selectedServices.includes(
																service.service_id
															)}
															onChange={() =>
																handleCheckboxChange(service.service_id)
															}
														/>
													</div>
												</div>
											</div>
										))}
									</div>
								</div>
								{/* additional requests section */}
								<section className="contact-section">
									<div className="auto-container">
										<div className="contact-title">
											<h2>Additional requests</h2>
										</div>
										<div className=" clearfix">
											<div className="form-column ">
												<div className="inner-column">
													<div className="contact-form">
														<form onSubmit={handleSubmitOrder}>
															<div className="row clearfix">
																<div className="form-group col-md-12">
																	{serverError && (
																		<div
																			className="validation-error"
																			role="alert"
																		>
																			{serverError}
																		</div>
																	)}
																	<textarea
																		name="form_message"
																		placeholder="Service description"
																		value={additionalRequest}
																		onChange={handleAdditionalRequest}
																	></textarea>
																</div>
																<div className="form-group col-md-12">
																	<input
																		type="text"
																		name="form_subject"
																		placeholder="order description"
																		required
																		value={orderDescription}
																		onChange={handleOrderDescription}
																	/>
																</div>
																<div className="form-group col-md-12">
																	<input
																		type="text"
																		name="form_subject"
																		placeholder="Price"
																		required
																		value={totalPrice}
																		onChange={handleTotalPrice}
																	/>
																</div>
																<div className="form-group col-md-12">
																	<button
																		className="theme-btn btn-style-one"
																		type="submit"
																		data-loading-text="Please wait..."
																	>
																		<span>SUBMIT ORDER</span>
																	</button>
																</div>
															</div>
															{success && (
																<div
																	style={{ color: "green" }}
																	className="success-message"
																>
																	Order added successfully!
																</div>
															)}
														</form>
													</div>
												</div>
											</div>
										</div>
									</div>
								</section>
							</>
						)}
					</div>
				</div>
			)}
		</>
	);
}

export default CustomerVehicle;
