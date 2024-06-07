

import React, { useState } from "react";
import customerService from "../../../../services/customer.service";
import { useAuth } from "../../../../Contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function AddNewCustomer(props) {
	const navigate = useNavigate();
	const [customer_email, setEmail] = useState("");
	const [customer_phone_number, setPhoneNumber] = useState("");
	const [customer_first_name, setFirstName] = useState("");
	const [customer_last_name, setLastName] = useState("");
	const [active_customer_status, setActiveCustomerStatus] = useState(1);

	const [emailError, setEmailError] = useState("");
	const [phoneError, setPhoneError] = useState("");
	const [firstNameRequired, setFirstNameRequired] = useState("");
	const [success, setSuccess] = useState(false);
	const [serverError, setServerError] = useState("");

	let loggedInEmployeeToken = "";
	const { employee } = useAuth();
	if (employee && employee.employee_token) {
		loggedInEmployeeToken = employee.employee_token;
	}

	const handleSubmit = (e) => {
		e.preventDefault();
		let valid = true;

		if (!customer_first_name) {
			setFirstNameRequired("First name is required");
			valid = false;
		} else {
			setFirstNameRequired("");
		}

		if (!customer_email) {
			setEmailError("Email is required");
			valid = false;
		} else if (!customer_email.includes("@")) {
			setEmailError("Invalid email format");
		} else {
			const regex = /^\S+@\S+\.\S+$/;
			if (!regex.test(customer_email)) {
				setEmailError("Invalid email format");
				valid = false;
			} else {
				setEmailError("");
			}
		}

		if (!customer_phone_number) {
			setPhoneError("Phone number is required");
			valid = false;
		} else {
			setPhoneError("");
		}

		if (!valid) {
			return;
		}

		const formData = {
			customer_email,
			customer_first_name,
			customer_last_name,
			customer_phone_number,
			// active_customer_status,
		};

		const newCustomer = customerService.createCustomer(
			formData,
			loggedInEmployeeToken
		);

		newCustomer
			.then((response) => response.json())
			.then((data) => {
				// console.log(data.customer.customer_id);
				const customer_id = data.customer.customer_id;
				if (data.status) {
					setSuccess(true);
					setServerError("");
					setTimeout(() => {
						navigate(`/admin/customer-profile/${customer_id}`);
					}, 2000);
				} else {
					setServerError("Failed to create a new customer");
				}
			})
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
		<section className="contact-section">
			<div className="auto-container">
				<div className="contact-title">
					<h2>Add a new customer</h2>
				</div>
				<div className="row clearfix">
					<div className="form-column col-lg-7">
						<div className="inner-column">
							<div className="contact-form">
								<form onSubmit={handleSubmit}>
									<div className="row clearfix">
										<div className="form-group col-md-12">
											{serverError && (
												<div className="validation-error" role="alert">
													{serverError}
												</div>
											)}
											<input
												type="email"
												name="customer_email"
												value={customer_email}
												onChange={(event) => setEmail(event.target.value)}
												placeholder="Customer email"
											/>
											{emailError && (
												<div className="validation-error" role="alert">
													{emailError}
												</div>
											)}
										</div>
										<div className="form-group col-md-12">
											<input
												type="text"
												name="customer_first_name"
												value={customer_first_name}
												onChange={(event) => setFirstName(event.target.value)}
												placeholder="Customer first name"
											/>
											{firstNameRequired && (
												<div className="validation-error" role="alert">
													{firstNameRequired}
												</div>
											)}
										</div>

										<div className="form-group col-md-12">
											<input
												type="text"
												name="customer_last_name"
												value={customer_last_name}
												onChange={(event) => setLastName(event.target.value)}
												placeholder="Customer last name"
												required
											/>
										</div>

										<div className="form-group col-md-12">
											<input
												type="text"
												name="customer_phone_number"
												value={customer_phone_number}
												onChange={(event) => setPhoneNumber(event.target.value)}
												placeholder="Customer phone (555-555-5555)"
												required
											/>
											{phoneError && (
												<div className="validation-error" role="alert">
													{phoneError}
												</div>
											)}
										</div>

										<div className="form-group col-md-12">
											<button
												className="theme-btn btn-style-one"
												type="submit"
												data-loading-text="Please wait..."
											>
												<span>Add customer</span>
											</button>
										</div>
									</div>
								</form>
								{success && (
									<div className="success-message">
										Customer added successfully!
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

export default AddNewCustomer;

