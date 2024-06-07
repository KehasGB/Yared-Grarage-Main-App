import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import orderService from "../../../services/order.service";

function OrderDetail() {
	const { order_hash } = useParams();
	const [apiError, setApiError] = useState(false);
	const [order, setOrder] = useState({});

	useEffect(() => {
		const singleOrderHash = orderService.getOrderHash(order_hash);
		singleOrderHash
			.then((res) => {
				if (!res.ok) {
					// console.log(res.status);
					setApiError(true);
				}
				return res.json();
			})
			.then((data) => {
				// console.log(data);
				if (data.length !== 0) {
					setOrder(data);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	return (
		<div>
			<section className="services-section">
				<div className="auto-container">
					<div className="sec-title style-two">
						<div className="row  ">
							<div className="col-lg-10 col-md-8 ">
								<h2>
									{order.customer?.customer_first_name +
										" " +
										order.customer?.customer_last_name}
								</h2>
							</div>
							<div className="col-lg-2 col-md-4 ">
								<span
									className={
										order.order?.order_status === 0
											? "order-status-inprogress"
											: "order-status-done"
									}
								>
									{order.order?.order_status === 0 ? "In Progress" : "Completed"}
								</span>
							</div>
						</div>

						<div className="text">
							You can track the progress of your order using this page.We will
							constantly update this page to let you know how we are
							progressing.As soon as we are done with the order, the status will
							turn green. That means,your car is ready for pickup.
						</div>
					</div>
					<div className="row">
						<div className="col-lg-6 service-block-one marginBottom">
							<div className="inner-box hvr-float-shadow">
								<h5>CUSTOMER</h5>
								<h2>
									{order.customer?.customer_first_name +
										" " +
										order.customer?.customer_last_name}
								</h2>
								<p className="mb-0">
									<span className="font-weight-bold">Email</span>:
									{String.fromCharCode(160)} {order.customer?.customer_email}
								</p>
								<p className="mb-0">
									<span className="font-weight-bold">Phone Number</span>:
									{String.fromCharCode(160)}{" "}
									{order.customer?.customer_phone_number}
								</p>
								<p>
									<span className="font-weight-bold">Active Customer</span>:
									{String.fromCharCode(160)}{" "}
									{order.customer?.active_customer_status == 1 ? " Yes" : " No"}
									
								</p>
							</div>
						</div>
						<div className="col-lg-6 service-block-one marginBottom">
							<div className="inner-box hvr-float-shadow">
								<h5>CAR IN SERVICE </h5>
								<h2>
									{order.vehicle?.vehicle_make} ({order.vehicle?.vehicle_color})
								</h2>
								<p className="mb-0">
									<span className="font-weight-bold">Vehicle tag</span>:
									{String.fromCharCode(160)} {order.vehicle?.vehicle_tag}
								</p>
								<p className="mb-0">
									<span className="font-weight-bold">Vehicle year</span>:
									{String.fromCharCode(160)} {order.vehicle?.vehicle_year}
								</p>
								<p>
									<span className="font-weight-bold">Vehicle mileage </span>:
									{String.fromCharCode(160)} {order.vehicle?.vehicle_mileage}
								</p>
							</div>
						</div>
					</div>

					<div className="wrapper-box selected-customer  ">
						<div className="left-column ">
							<h5> {order.vehicle?.vehicle_make} </h5>
							<h3 className="order-text1">Requested Service</h3>
							{order.service?.map((service, i) => (
								<div
									className=" mt-2 px-3 service-item checkbox-holder"
									key={i}
								>
									<h5 className="order-text2">{service.service_name}</h5>
									<div className="row  ">
										<div className="col-10 ">{service.service_description}</div>
										<div className="col-2 ">
											<span
												className={`mr-4
											${!service.service_completed ? "order-status-inprogress" : "order-status-done"}
										`}
											>
												{service.service_completed
													? "Completed "
													: "InProgress "}
											</span>
										</div>
									</div>
								</div>
							))}
							<br />
							{/* <h4 className="order-text1">Additional information</h4> */}
							<div className="sec-title style-two">
								<h3>Additional information</h3>
								<br />
								<p className="mb-0">
									<span className="font-weight-bold">Order Date</span>:
									{String.fromCharCode(160)} {order.order?.order_date}
								</p>
								<p className="mb-0">
									<span className="font-weight-bold">
										Estimated Completion Date
									</span>
									:{String.fromCharCode(160)}{" "}
									{order.order?.estimated_completion_date}
								</p>
								<p className="mb-0">
									<span className="font-weight-bold">Total Price</span>:
									{String.fromCharCode(160)} ${order.order?.order_total_price}
								</p>
								<h5 className="text-center font-weight-bold">
									{" "}
									Thank you for choosing us!!
								</h5>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}

export default OrderDetail;
