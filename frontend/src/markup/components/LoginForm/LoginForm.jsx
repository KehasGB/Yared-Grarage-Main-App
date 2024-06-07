import React, { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import loginService from "../../../services/login.service";
function LoginForm(props) {
	const location = useLocation();
	const [employee_email, setEmail] = useState("");
	const [employee_password, setPassword] = useState("");
	const [emailError, setEmailError] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const [serverError, setServerError] = useState("");

	// Function to handle the form submission.

	const handleSubmit = async (e) => {
		e.preventDefault(); // Prevents page refresh on submit.
		// Handle client-side validation
		let valid = true; // Flag
		// Email validation

		if (!employee_email) {
			setEmailError("Please provide an email address.");
			valid = false;
		} else if (!employee_email.includes("@")) {
			setEmailError("Invalid email format.");
			valid = false;
		} else {
			const regex = /^\S+@\S+$/;
			if (!regex.test(employee_email)) {
				setEmailError("Please provide a valid e-mail address.");
				valid = false;
			} else {
				setEmailError("");
			}
		}

		// Password has to be at least 6 characters long
		if (employee_password.length < 6) {
			setPasswordError("Password must be at least 6 characters.");
			valid = false;
		} else {
			setPasswordError("");
		}

		// If the form is not valid, do not submit
		if (!valid) {
			return;
		}

		// Handle form submission here
		const formData = {
			employee_email,
			employee_password,
		};

		// Call the service
		const loginEmployee = loginService.logIn(formData);

		loginEmployee
			.then((response) => response.json())
			.then((response) => {
				// console.log(response);

				// If an error is returned from the API server, set the error message
				if (response.status === "success") {
					// Save the user in local storage
					if (response.data.employee_token) {
						// console.log(response.data);
						localStorage.setItem("employee", JSON.stringify(response.data));
					}
					// // Navigate to admin
					// console.log(location);
					if (location.pathname === "/login") {
						window.location.replace("/");
					} else {
						window.location.reload();
					}
				} else {
					// Show an error message
					setServerError(response.message);
				}
			})
			.catch((err) => {
				console.log(err.message);
				setServerError("An error has occurred. Please try again later");
			});
	};
	// console.log(employee);
	return (
		<section className="contact-section">
			<div className="auto-container">
				<div className="contact-title">
					<h2>Login to your account</h2>
				</div>
				<div className="row clearfix">
					<div className="form-column col-lg-7">
						<div className="inner-column">
							<div className="contact-form">
								<form onSubmit={handleSubmit}>
									<div className="row clearfix">
										<div className="form-group col-md-12">
											{serverError && (
												<div className="validation-error">{serverError} </div>
											)}
											<input
												type="email"
												value={employee_email}
												name="employee_email"
												onChange={(event) => setEmail(event.target. value)}
												placeholder="Email"
											/>
											{emailError && (
												<div className="validation-error" role="alert">
													{emailError ? "Invalid Email ID." : ""}
												</div>
											)}
										</div>
										<div className="form-group col-md-12">
											<input
												type="password"
												value={employee_password}
												name="employee_password"
												onChange={(event) => setPassword(event.target.value)}
												placeholder="Password"
											/>
											{passwordError && (
												<div
													className="validation-error"
													style={{ color: "red", fontSize: "0.8rem" }}
												>
													{passwordError}
												</div>
											)}
										</div>
										<div className="form-group col-md-12">
											<button
												className="theme-btn btn-style-one"
												type="submit"
												data-loading-text="Please wait..."
											>
												<span>Login</span>
											</button>
										</div>
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

export default LoginForm;
