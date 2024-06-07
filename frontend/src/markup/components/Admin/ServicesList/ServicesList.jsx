import React, { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import { useAuth } from "../../../../Contexts/AuthContext";
import serviceService from "../../../../services/service.service";
import { Link, useNavigate } from "react-router-dom";

const ServicesList = (editClicked) => {
	const [services, setServices] = useState([]);
	const [apiError, setApiError] = useState(false);
	const [apiErrorMessage, setApiErrorMessage] = useState(null);
	const [newService, setNewService] = useState({
		service_name: "",
		service_description: "",
	});
	const navigate = useNavigate();
	const { service } = useAuth();
	let token = null;
	const [loading, setLoading] = useState(true);
	const [success, setSuccess] = useState("");

	// Call the getAllservices function
	const getServices = async () => {
		const allServices = serviceService.getAllServices(token);
		allServices
			.then((res) => {
				if (!res.ok) {
					setApiError(true);
					if (res.status === 401) {
						setApiErrorMessage("Please login again!");
					} else if (res.status === 403) {
						setApiErrorMessage("You are not authorized to view this page!");
					} else {
						setApiErrorMessage("Please try again later!");
					}
					throw new Error("Failed to fetch data!!");
				}
				return res.json();
			})
			.then((data) => {
				if (data && data.length !== 0) {
					setServices(data.services);
				}
				setLoading(false);
			})
			.catch((err) => {
				setLoading(false);
			});
	};

	useEffect(() => {
		getServices();
	}, []);

	// Function to handle adding a new service
	const handleAddService = async (e) => {
		e.preventDefault();

		if (!newService.service_name || !newService.service_description) {
			// Handle validation errors or show a message
			alert("Service name and service description fields cannot be empty!");
			return;
		}
		setLoading(true);
		try {
			const response = await serviceService.createService(newService);

			if (!response.ok) {
				setApiError(true);
				let errorMessage = `Failed to add a new service. Status: ${response.status}. Please try again later!`;

				if (response.status === 401) {
					errorMessage = "Please login again!";
				} else if (response.status === 403) {
					errorMessage = "You are not authorized to add a new service!";
				}

				setApiErrorMessage(errorMessage);
				throw new Error(`Failed to add a new service: ${errorMessage}`);
			}

			setNewService({ service_name: "", service_description: "" });
			setSuccess("service added succesconsolesfully!");
			setTimeout(() => {
				setSuccess("");
			}, 2000);
			getServices();
		} catch (error) {
			console.error(error);
			setApiError(true);
			setApiErrorMessage(
				"An error occurred while adding a new service. Please try again later."
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<div className="sec-title style-two">
				<h2>Services we provide</h2>
				<div className="text">
					Bring to the table win-win survival strategies to ensure proactive
					domination. At the end of the day, going forward, a new normal that
					has evolved from generation X is on the runway heading towards a
					streamlined cloud solution.
				</div>

				<div className="wrapper-box selected-customer">
					<div className="left-column">
						{services?.map((service) => (
							<div className=" mt-2 px-3 service-item" key={service.service_id}>
								<h3 className="text-b">{service.service_name}</h3>
								<div className="row  ">
									<div className="col-11 ">
										<p> {service.service_description}</p>
									</div>
									<div className="col-1 ">
										<div className="edit-delete-icons ">
											<Link
												to={`/admin/service/edit/${service.service_id}`}
												className="text-danger pr-2"
												onClick={() => editClicked(true)}
											>
												<FaEdit />
											</Link>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
			<section className="contact-section">
				<div className="auto-container">
					<div className="contact-title">
						<h2>Add a new service</h2>
					</div>
					<div className=" clearfix">
						<div className="form-column ">
							<div className="inner-column">
								<div className="contact-form">
									<form onSubmit={handleAddService}>
										<div className="row clearfix">
											<div className="form-group col-md-9">
												<input
													value={newService.service_name}
													onChange={(event) =>
														setNewService({
															...newService,
															service_name: event.target.value,
														})
													}
													type="text"
													name="form_subject"
													placeholder="Service name"
												/>
											</div>
											<div className="form-group col-md-9">
												<textarea
													value={newService.service_description}
													onChange={(event) =>
														setNewService({
															...newService,
															service_description: event.target.value,
														})
													}
													name="form_message"
													placeholder="Service description"
												></textarea>
											</div>

											<div className="form-group col-md-12">
												<button
													className="theme-btn btn-style-one"
													type="submit"
													data-loading-text="Loading..."
												>
													<span>Add service</span>
												</button>
											</div>
										</div>
									</form>
									{success && (
										<div>
											<h4 className="text-success ">{success}</h4>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</>
	);
};

export default ServicesList;
