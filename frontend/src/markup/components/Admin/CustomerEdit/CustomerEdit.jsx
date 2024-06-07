import React, { useState, useEffect } from "react";
import { useAuth } from "../../../../Contexts/AuthContext";
import customerServices from "../../../../services/customer.service";
import { useNavigate, useParams } from "react-router-dom";

function CustomerEdit() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [getCustomer, setgetCustomer] = useState({});
	const [customerValue, setCustomerValue] = useState({
		customer_first_name: "",
		customer_last_name: "",
		customer_phone_number: "",
		active_customer_status: "",
		customer_email: "",
	});

	const [apiError, setApiError] = useState(false);
	const [apiErrorMessage, setApiErrorMessage] = useState(null);
	const [serverError, setServerError] = useState("");
	const [success, setSuccess] = useState(false);
	const [updateSuccess, setUpdateSuccess] = useState(false);

	let loggedInEmployeeToken = "";

	const { employee } = useAuth();
	if (employee) {
		loggedInEmployeeToken = employee.employee_token;
	}

	const handleInputChange = (e) => {
		const { name, value, type, checked } = e.target;
		// console.log(name, value);

		if (type === "checkbox") {
			setCustomerValue((prevCustomer) => ({
				...prevCustomer,
				[name]: checked ? 1 : 0,
			}));
		} else {
			setCustomerValue((prevCustomer) => ({
				...prevCustomer,
				[name]: value,
			}));
		}
	};

	useEffect(() => {
		const singleCustomer = customerServices.getCustomer(
			loggedInEmployeeToken,
			id
		);

		singleCustomer
			.then((response) => response.json())
			.then((data) => {
				// console.log(data);

				if (data) {
					setgetCustomer(data);
					setCustomerValue({
						customer_phone_number: data.customer_phone_number || "",
						customer_first_name: data.customer_first_name || "",
						customer_last_name: data.customer_last_name || "",
						active_customer_status: data.active_customer_status,
					});
				} else {
					console.error("Invalid data structure:", data);
				}
			})
			.catch((err) => {
				console.error("Error fetching customer data:", err);
			});
	}, [id, loggedInEmployeeToken]);

	const handleSubmit = (e) => {
		e.preventDefault();

		const updateCustomer = customerServices.updateCustomer(
			id,
			customerValue,
			loggedInEmployeeToken
		);

		updateCustomer
			.then((response) => response.json())
			.then((data) => {
				// console.log(data);

				if (data.error) {
					setServerError(data.error);
				} else {
					setSuccess(true);
					setUpdateSuccess(true);
					setServerError("");

					setTimeout(() => {
						navigate("/admin/customers");
					}, 2000);
				}
			});
	};

	return (
		<section className="contact-section">
			<div className="auto-container">
				<div className="contact-title">
					<h2>
						Edit:{" "}
						{`${getCustomer.customer_first_name || "N/A"} ${
							getCustomer.customer_last_name || "N/A"
						}`}
					</h2>
					<h5>Customer email: {getCustomer.customer_email || "N/A"} </h5>
				</div>

				<div className="row clearfix">
					<div className="form-column col-lg-7">
						<div className="inner-column">
							<div className="contact-form">
								<form onSubmit={handleSubmit}>
									<div className="row clearfix">
										<div className="form-group col-md-12">
											<input
												type="text"
												name="customer_phone_number"
												value={customerValue.customer_phone_number}
												onChange={handleInputChange}
												placeholder="Customer Phone"
											/>
										</div>
										<div className="form-group col-md-12">
											<input
												type="text"
												name="customer_first_name"
												value={customerValue.customer_first_name}
												onChange={handleInputChange}
												placeholder="Customer First Name"
											/>
										</div>
										<div className="form-group col-md-12">
											<input
												type="text"
												name="customer_last_name"
												value={customerValue.customer_last_name}
												onChange={handleInputChange}
												placeholder="Customer Last Name"
											/>
										</div>

										<div className="form-group col-md-12">
											<input
												type="checkbox"
												name="active_customer_status"
												checked={customerValue.active_customer_status}
												onChange={handleInputChange}
											/>
											<span style={{ marginLeft: "8px" }}>
												Is active customer
											</span>
										</div>

										<div className="form-group col-md-12">
											<button
												className="theme-btn btn-style-one"
												type="submit"
												data-loading-text="Please wait..."
											>
												<span>UPDATE</span>
											</button>
										</div>
										{updateSuccess && (
											<div
												style={{ color: "green" }}
												className="success-message"
											>
												Data updated successfully!
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

export default CustomerEdit;
