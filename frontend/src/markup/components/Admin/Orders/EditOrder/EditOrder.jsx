import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import orderService from "../../../../../services/order.service";
import { useAuth } from "../../../../../Contexts/AuthContext";
import customerService from "../../../../../services/customer.service";
import vehicleService from "../../../../../services/vehicle.service";
import serviceService from "../../../../../services/service.service";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
function EditOrder() {
	const [selectedDate, setSelectedDate] = useState(null);
	const navigate = useNavigate();
	const { employee } = useAuth();
	const { order_id } = useParams();
	const [order, setOrder] = useState({});
	const [customer, setCustomer] = useState({});
	const [vehicle, setVehicle] = useState({});
	const [services, setServices] = useState([]);
	const [requestedServices, setRequestedServices] = useState([]);
	const [mergedServices, setMergedServices] = useState([]);
	const [orderData, setOrderData] = useState({
		active_order: "",
		order_total_price: "",
		estimated_completion_date: "",
		completion_date: "",
		
		order_completed: "",
		
		additional_requests_completed: "",
		order_services: "",
	});

	// error
	const [apiError, setApiError] = useState(false);
	const [apiErrorMessage, setApiErrorMessage] = useState(null);
	const [serverError, setServerError] = useState("");
	const [success, setSuccess] = useState(false);
	const [updateSuccess, setUpdateSuccess] = useState(false);
	// Create a variable to hold the user's token

	let token = null;
	if (employee) {
		token = employee.employee_token;
	}

	useEffect(() => {
		const singleOrderResponse = async () => {
			
			try {
				// fetching single order by order id

				const response = await orderService.singleOrder(token, order_id);
				if (response.status === 200) {
					const data = await response.json();
					// console.log("coming original order:", data);
					setOrder(data);
					setOrderData({
						active_order: data?.active_order,
						order_total_price: data?.order_total_price,
						estimated_completion_date: data?.estimated_completion_date,
						completion_date: data?.completion_date,
						
						order_completed: data?.order_status,
						
						additional_requests_completed: data?.additional_requests_completed,
						order_services: data?.order_services,
					});
					await fetchCustomer(data);
					await fetchVehicle(data);
					await fetchServices(data);
				} else {
					setApiError(true);
					if (response.status === 401) {
						setApiErrorMessage("Please login again");
					} else if (response.status === 403) {
						setApiErrorMessage("You are not authorized to view this page");
					} else {
						setApiErrorMessage("Please try again later");
					}
				}
			} catch (error) {
				console.log(error);
			}
		};
		
		singleOrderResponse();
		// console.log("orders;", order.order_services);
	}, []);
	// console.log("selected service", orderData.order_services);
	// console.log("coming order to be update:", orderData);

	// fetch customer based on customer id
	const fetchCustomer = async (order) => {
		try {
			const customerId = order.customer_id;
			const response = await customerService.getCustomer(token,customerId);
			const customer = await response.json();

			setCustomer(customer);
		} catch (error) {
			console.log(error);
		}
	};

	// fetch vehicle based on vehicle id
	const fetchVehicle = async (order) => {
		try {
			const vehicleId = order.vehicle_id;
			// fetch vehicle info based on vehicle id
			const response = await vehicleService.getSingleVehicleById(vehicleId);
			const vehicle = await response.json();
			setVehicle(vehicle);
		} catch (error) {
			console.log(error);
		}
	};
	// fetch ordered services
	const fetchServices = async (order) => {
		// console.log("order is:", order);

		try {
			const serviceIds = order.order_services.map(
				(service) => service.service_id
			);
			// console.log("serviceIds:", serviceIds);
			const responses = await Promise.all(
				serviceIds.map((serviceId) =>
					serviceService.getSingleService(serviceId)
				)
			);
			// console.log("responses from get service:", responses);
			const servicesData = await Promise.all(
				responses.map((res) => res.json())
			);
			// console.log("servicesData with json:", servicesData);
			const servicesMap = servicesData.map((service) => {
				return {
					service_id: service.service_id,
					service_name: service.service_name,
					service_description: service.service_description,
					service_completed: order.order_services.filter(
						(item) => service.service_id == item.service_id
					)[0].service_completed,
					order_service_id: order.order_services.filter(
						(item) => service.service_id == item.service_id
					)[0].order_service_id,
				};
			});
			// console.log("service maps:", servicesMap);
			setRequestedServices(servicesMap)
		} catch (error) {
			console.log(error);
		}
	};

	// handle submit order
	const handleSubmit = (e) => {
		e.preventDefault();
		// check if the order is complete
		if (!orderData.order_completed) {
			setOrderData({
				...orderData,
				completion_date: null,
			});
		}
		// console.log('new updated order:',orderData);
		//  the logic to update the order using the updatedOrder state
		const updatOrder = orderService.updateOrder(token, order_id, orderData);

		updatOrder
			.then((response) => response.json())
			.then((data) => {
				// console.log("response from update service",data);
				// If Error is returned from the API server, set the error message
				if (data.error) {
					setServerError(data.error);
				} else {
					// Handle successful response
					setSuccess(true);
					setUpdateSuccess(true);
					setServerError("");
					// Redirect to the employees page after 2 seconds
					setTimeout(() => {
						navigate("/admin/orders");
					}, 1000);
				}
			});
	};

	// handle check box change for order sevices
	const handleCheckboxChange = (service) => {
		// console.log("service clicked:",service);
		const updatedOrderServices = requestedServices.map((item) => {
			if (item.service_id === service.service_id) {
				return {
					...item,
					service_completed: !item.service_completed,
				};
			}
			return item;
		});

		// Update the state with the modified array
		setRequestedServices(updatedOrderServices);

		// Update the orderData with the modified array
		setOrderData((prevOrderData) => ({
			...prevOrderData,
			order_services: updatedOrderServices,
		}));
	};

// console.log("final data:",orderData);
	return (
		<section className="contact-section">
			{/* customer info */}
			<div className="contact-title">
				<h2>Update Order </h2>
			</div>
			<div className="row">
				<div className="col-lg-6 service-block-one">
					<div className="inner-box hvr-float-shadow">
						<h5>CUSTOMER</h5>
						<div className="wrapper-box ">
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
							</div>
						</div>
					</div>
				</div>
				{/* vehicle info */}
				<div className="col-lg-6 service-block-one">
					<div className="inner-box hvr-float-shadow">
						<h5>CAR IN SERVICE</h5>
						<div className="wrapper-box  ">
							<div className="left-column text">
								<h6 className="order-text1">
									{vehicle.vehicle_make + " " + vehicle.vehicle_model}
									<br />
								</h6>
								<span className="order-text2">Vehicle tag</span>:
								{vehicle.vehicle_tag} <br />
								<span className="order-text2">Vehicle year</span>:
								{vehicle.vehicle_year} <br />
								<span className="order-text2">Vehicle milage</span>:
								{vehicle.vehicle_mileage}
								<br />
							</div>
						</div>
						{/* <div className="icon">
							<span className="flaticon-spray-gun"></span>
						</div> */}
					</div>
				</div>
			</div>
			{/* SERVICES */}
			<div className="wrapper-box selected-customer ">
				<div className="left-column ">
					<h6 className="order-text1">Requested Services</h6>
					{requestedServices?.map((service, i) => (
						<div className=" mt-2 px-3 service-item checkbox-holder" key={i}>
							<h5 className="order-text2">{service.service_name}</h5>
							<div className="row  ">
								<div className="col-10 ">{service.service_description}</div>
								<div className="col-2 ">
									<span
										className={`mr-4
											${!service.service_completed ? "order-status-inprogress" : "order-status-done"}
										`}
									>
										{service.service_completed ? "Completed " : "InProgress "}
									</span>
									<input
										type="checkbox"
										name={`service_${service.service_id}`}
										id={`service_${service.service_id}`}
										value={service.service_id}
										checked={service.service_completed}
										onChange={() => handleCheckboxChange(service)}
									/>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
			<div className="auto-container">
				<div className=" clearfix">
					<div className="form-column col-lg-7">
						<div className="inner-column">
							<div className="contact-form">
								<form onSubmit={handleSubmit}>
									<div className="row clearfix">
										<div className="form-group col-md-12">
											<label htmlFor="eta">Estimated completion date:</label>
											<input
												type="text"
												name="eta"
												placeholder="ETA"
												value={new Date(
													orderData.estimated_completion_date
												).toLocaleString()}
												onChange={(event) =>
													setOrderData({
														...orderData,
														estimated_completion_date: event.target.value,
													})
												}
												required
											/>
										</div>

										{/* <div className="form-group col-md-6">
											<label htmlFor="eta">Estimated completion date:</label> <br />
											<DatePicker
												selected={selectedDate}
												onChange={(date) =>
													handleDateChange(date, "estimated_completion_date")
												}
												dateFormat="yyyy-MM-dd"
												placeholderText="Select a date"
											/>
										</div> */}

										<div className="form-group col-md-12">
											<label htmlFor="eta"> completed on: </label>

											

											<input
												type="text"
												name="eta"
												placeholder="ETA"
												value={new Date().toISOString()}
												onChange={(event) =>
													setOrderData({
														...orderData,
														completion_date: event.target.value,
													})
												}
												required
											/>
										</div>

										

										<div className="form-group col-md-12">
											<label htmlFor="price">Order total price:</label>
											<input
												type="text"
												name="price"
												placeholder="Price"
												value={orderData.order_total_price}
												onChange={(event) =>
													setOrderData({
														...orderData,
														order_total_price: event.target.value,
													})
												}
												required
											/>
										</div>
										<div className="form-group col-md-12">
											<input
												type="checkbox"
												name="additionaRequest"
												checked={orderData.additional_requests_completed}
												onChange={(event) =>
													setOrderData({
														...orderData,
														additional_requests_completed: event.target.checked,
													})
												}
											/>
											<span style={{ marginLeft: "8px" }}>
												Additional service completed ?
											</span>
										</div>
										<div className="form-group col-md-12">
											<input
												type="checkbox"
												name="orderStatus"
												checked={orderData.active_order}
												onChange={(event) =>
													setOrderData({
														...orderData,
														active_order: event.target.checked,
													})
												}
											/>
											<span style={{ marginLeft: "8px" }}>Active order ?</span>
										</div>
										<div className="form-group col-md-12">
											<input
												type="checkbox"
												name="orderStatus"
												checked={orderData.order_completed}
												onChange={(event) =>
													setOrderData({
														...orderData,
														order_completed: event.target.checked,
													})
												}
											/>
											<span style={{ marginLeft: "8px" }}>
												Order completed ?
											</span>
										</div>
										<div className="form-group col-md-12">
											<button
												className="theme-btn btn-style-one"
												type="submit"
												data-loading-text="Please wait..."
											>
												<span>UPDATE ORDER</span>
											</button>
										</div>
										{updateSuccess && (
											<div className="success-message font-weight-bold">
												Order updated successfully!
											</div>
										)}
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

export default EditOrder;
