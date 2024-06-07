import React, { useState } from "react";
import vehicleService from "../../../../services/vehicle.service";
import { useParams } from "react-router-dom";

function AddVehicleForm({ toggle }) {
	const [vehicle_year, setVehicleYear] = useState("");
	const [vehicle_make, setVehicleMake] = useState("");
	const [vehicle_model, setVehicleModel] = useState("");
	const [vehicle_type, setVehicleType] = useState("");
	const [vehicle_mileage, setVehicleMileage] = useState("");
	const [vehicle_tag, setVehicleTag] = useState("");
	const [vehicle_serial, setVehicleSerial] = useState("");
	const [vehicle_color, setVehicleColor] = useState("");
	const { customer_id } = useParams();
	// console.log(customer_id);
	// Errors
	const [Error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [serverError, setServerError] = useState("");
	// console.log(success);
	const handleSubmit = (e) => {
		e.preventDefault();
		// Handle client side validations
		let valid = true; // Flag

		if (
			!customer_id ||
			!vehicle_year ||
			!vehicle_make ||
			!vehicle_model ||
			!vehicle_type ||
			!vehicle_mileage ||
			!vehicle_tag ||
			!vehicle_serial ||
			!vehicle_color
		) {
			setError("All fields required");
			valid = false;
		} else {
			setError("");
		}
		// If the form is not valid, do not submit
		if (!valid) {
			return;
		}
		const formData = {
			customer_id,
			vehicle_year,
			vehicle_make,
			vehicle_model,
			vehicle_type,
			vehicle_mileage,
			vehicle_tag,
			vehicle_serial,
			vehicle_color,
		};

		// Pass the form data to the service
		const newVehicle = vehicleService.createVehicle(formData);
		newVehicle
			.then((response) => response.json())
			.then((data) => {
				// console.log(data);
				// // If Error is returned from the API server, set the error message
				if (data.error) {
					setServerError(data.error);
				} else {
					// Handle successful response
					setSuccess("vehicle added successfully");
					setServerError("");

					// Redirect to the add vehicle  page after 2 seconds
					//  just redirect to the customer detail page
					setTimeout(() => {
						// window.location.href = '/admin/employees';
						toggle();
					}, 2000);
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
		<section className="contact-section">
			<div className="auto-container">
				<div className="contact-title">
					<h3>Add a new vehicle</h3>
				</div>
				<div className="row clearfix">
					<div className="form-column col-lg-10">
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
												type="text"
												name="vehicle_year"
												value={vehicle_year}
												onChange={(event) => setVehicleYear(event.target.value)}
												placeholder="Vehicle year"
												required
											/>
										</div>
										<div className="form-group col-md-12">
											<input
												type="text"
												name="vehicle_make"
												value={vehicle_make}
												onChange={(event) => setVehicleMake(event.target.value)}
												placeholder="Vehicle make"
												required
											/>
										</div>

										<div className="form-group col-md-12">
											<input
												type="text"
												name="vehicle_model"
												value={vehicle_model}
												onChange={(event) =>
													setVehicleModel(event.target.value)
												}
												placeholder="Vehicle model"
												required
											/>
										</div>

										<div className="form-group col-md-12">
											<input
												type="text"
												name="vehicle_type"
												value={vehicle_type}
												onChange={(event) => setVehicleType(event.target.value)}
												placeholder="Vehicle type"
												required
											/>
										</div>

										<div className="form-group col-md-12">
											<input
												type="text"
												name="vehicle_mileage"
												value={vehicle_mileage}
												onChange={(event) =>
													setVehicleMileage(event.target.value)
												}
												placeholder="Vehicle mileage"
												required
											/>
											{/* {passwordError && (
												<div className="validation-error" role="alert">
													{passwordError}
												</div>
											)} */}
										</div>
										<div className="form-group col-md-12">
											<input
												type="text"
												name="vehicle_tag"
												value={vehicle_tag}
												onChange={(event) => setVehicleTag(event.target.value)}
												placeholder="Vehicle tag"
												required
											/>
										</div>
										<div className="form-group col-md-12">
											<input
												type="text"
												name="vehicle_serial"
												value={vehicle_serial}
												onChange={(event) =>
													setVehicleSerial(event.target.value)
												}
												placeholder="Vehicle serial"
												required
											/>
										</div>
										<div className="form-group col-md-12">
											<input
												type="text"
												name="vehicle_color"
												value={vehicle_color}
												onChange={(event) =>
													setVehicleColor(event.target.value)
												}
												placeholder="Vehicle color"
											/>
											{Error && (
												<div className="validation-error" role="alert">
													{Error}
												</div>
											)}
											{success && (
												<div className="success-message" role="alert">
													{success}
												</div>
											)}
										</div>

										<div className="form-group col-md-12">
											<button
												className="theme-btn btn-style-one"
												type="submit"
												data-loading-text="Please wait..."
											>
												<span>Add vehicle</span>
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

export default AddVehicleForm;
