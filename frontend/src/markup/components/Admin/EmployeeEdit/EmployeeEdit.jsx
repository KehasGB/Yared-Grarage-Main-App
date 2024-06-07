import React, { useState, useEffect } from "react";
import employeeService from "../../../../services/employee.service";
import { useAuth } from "../../../../Contexts/AuthContext";
import { useNavigate, useParams } from "react-router-dom";

function EmployeeEdit() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [getemployee, setgetEmployee] = useState({});
	const [employeeValue, setEmployeeValue] = useState({
		employee_first_name: "",
		employee_last_name: "",
		employee_phone: "",
		company_role_id: "",
		active_employee: "",
	});

	const [apiError, setApiError] = useState(false);
	const [apiErrorMessage, setApiErrorMessage] = useState(null);
	const [serverError, setServerError] = useState("");
	const [success, setSuccess] = useState(false);
	const [updateSuccess, setUpdateSuccess] = useState(false);
	// Create a variable to hold the user's token
	let loggedInEmployeeToken = "";
	// Destructure the auth hook and get the token
	const { employee } = useAuth();
	if (employee && employee.employee_token) {
		loggedInEmployeeToken = employee.employee_token;
	}
	useEffect(() => {
		const singleEmployee = employeeService.getEmployee(
			loggedInEmployeeToken,id
			
		);
		singleEmployee
			.then((res) => {
				if (!res.ok) {
					// console.log(res.status);
					setApiError(true);
					if (res.status === 401) {
						setApiErrorMessage("Please login again");
					} else if (res.status === 403) {
						setApiErrorMessage("You are not authorized to view this page");
					} else {
						setApiErrorMessage("Please try again later");
					}
				}
				return res.json();
			})
			.then((data) => {
				// console.log(data);
				if (data.length !== 0) {
					setgetEmployee(data);
					setEmployeeValue({
						employee_first_name: data?.employee_first_name || "",
						employee_last_name: data?.employee_last_name || "",
						employee_phone: data?.employee_phone || "",
						company_role_id: data?.company_role_id || "",
						active_employee: data?.active_employee ,
					});
				}
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);
	//  console.log("id:",employeeValue.active_employee)
	const handleSubmit = (e) => {
		e.preventDefault();
		const updateEmployee = employeeService.updateEmployee(
			id,
			employeeValue,
			loggedInEmployeeToken
		);
		updateEmployee
			.then((response) => response.json())
			.then((data) => {
				// console.log(data);
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
						navigate("/admin/employees");
					}, 2000);
				}
			});
	};

	return (
		<section className="contact-section">
			<div className="auto-container">
				<div className="contact-title">
					<h2>Edit: {getemployee?.employee_first_name} </h2>
					<h5>Employee email: {getemployee?.employee_email} </h5>
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
												name="employee_first_name"
												value={employeeValue.employee_first_name}
												onChange={(event) =>
													setEmployeeValue({
														...employeeValue,
														employee_first_name: event.target.value,
													})
												}
												placeholder="Employee first name"
											/>
										</div>
										<div className="form-group col-md-12">
											<input
												type="text"
												name="employee_last_name"
												value={employeeValue.employee_last_name}
												onChange={(event) =>
													setEmployeeValue({
														...employeeValue,
														employee_last_name: event.target.value,
													})
												}
												placeholder="Employee last name"
											/>
										</div>

										<div className="form-group col-md-12">
											<input
												type="text"
												name="employee_phone"
												value={employeeValue.employee_phone}
												onChange={(event) =>
													setEmployeeValue({
														...employeeValue,
														employee_phone: event.target.value,
													})
												}
												placeholder="Employee phone"
											/>
										</div>

										<div className="form-group col-md-12">
											<select
												name="employee_role"
												value={employeeValue.company_role_id}
												onChange={(event) =>
													setEmployeeValue({
														...employeeValue,
														company_role_id: event.target.value,
													})
												}
												className="custom-select-box"
											>
												<option value="1">Employee</option>
												<option value="2">Manager</option>
												<option value="3">Admin</option>
											</select>
										</div>

										<div className="form-group col-md-12">
											<input
												type="checkbox"
												name="employeeStatus"
												checked={employeeValue.active_employee}
												onChange={(event) =>
													setEmployeeValue({
														...employeeValue,
														active_employee: event.target.checked,
													})
												}
											/>
											<span style={{ marginLeft: "8px" }}>
												is active employee
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
											<div className="success-message">
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

export default EmployeeEdit;
