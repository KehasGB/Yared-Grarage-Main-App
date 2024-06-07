import React, { useEffect, useState } from "react";
import serviceService from "../../../../services/service.service";
import { useNavigate, useParams } from "react-router-dom";

function ServiceEdit() {
	const [service_name, setServiceName] = useState("");
	const [service_description, setServiceDescription] = useState("");
	const [serviceValue, setServiceValue] = useState({
		service_name: "",
		service_description: "",
	});
	const [getService, setGetService] = useState({});
	const [success, setSuccess] = useState(false);

	const { id } = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		const singleService = serviceService.getSingleService(id);
		singleService
			.then((res) => {
				if (res) {
					// console.log(res);
				}
				return res.json();
			})
			.then((data) => {
				// console.log(data);
				if (data.length !== 0) {
					setGetService(data);
					setServiceValue({
						service_name: data?.service_name || "",
						service_description: data?.service_description || "",
					});
				}
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	const handleUpdate = (event) => {
		event.preventDefault();
		const editService = serviceService.updateService(id, serviceValue);

		editService
			.then((response) => response.json())
			.then((data) => {
				// console.log(data);

				if (data.error) {
					console.log(data.error);
				} else {
					setSuccess(true);

					setTimeout(() => {
						navigate("/admin/services");
					}, 2000);
				}
			});
	};

	return (
		<div className="mt-5">
			<h1 className="mb-4">Update Service</h1>
			<div className=" clearfix">
				<div className="form-column ">
					<div className="inner-column">
						<div className="contact-form">
							<form onSubmit={handleUpdate}>
								<div className="row clearfix">
									<div className="form-group col-md-12">
										<input
											type="text"
											name="form_subject"
											placeholder="Service name"
											value={serviceValue.service_name}
											onChange={(event) =>
												setServiceValue({
													...serviceValue,
													service_name: event.target.value,
												})
											}
										/>
									</div>
									<div className="form-group col-md-12">
										<textarea
											name="form_message"
											placeholder="Service description"
											value={serviceValue.service_description}
											onChange={(event) =>
												setServiceValue({
													...serviceValue,
													service_description: event.target.value,
												})
											}
										></textarea>
									</div>

									<div className="form-group col-md-12">
										<button
											className="theme-btn btn-style-one"
											type="submit"
											data-loading-text="Loading..."
										>
											<span>Edit service</span>
										</button>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ServiceEdit;
