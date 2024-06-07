import React from "react";
import { useAuth } from "../../../../Contexts/AuthContext";
import LoginForm from "../../LoginForm/LoginForm";

function Dashboard() {
	const { isLogged, isAdmin, isManager } = useAuth();
	if (isLogged) {
		if (isAdmin) {
			return (
				<div>
					<section className="services-section">
						<div className="auto-container">
							<div className="sec-title style-two">
								<h2>Admin Dashboard</h2>

								<div className="text">
									Bring to the table win-win survival strategies to ensure
									proactive domination. At the end of the day, going forward, a
									new normal that has evolved from generation X is on the runway
									heading towards a streamlined cloud solution.
								</div>
							</div>

							<div className="row">
								<div className="col-lg-4 service-block-one">
									<div className="inner-box hvr-float-shadow">
										<h5>OPEN FOR ALL</h5>
										<h2>All Orders</h2>

										<a href="/admin/orders" className="read-more">
											LIST OF ORDERS +
										</a>

										<div className="icon">
											<span className="flaticon-power"></span>
										</div>
									</div>
								</div>

								<div className="col-lg-4 service-block-one">
									<div className="inner-box hvr-float-shadow">
										<h5>OPEN FOR LEADS</h5>
										<h2>New Orders</h2>

										<a href="/admin/order" className="read-more">
											ADD ORDER+
										</a>

										<div className="icon">
											<span className="flaticon-gearbox"></span>
										</div>
									</div>
								</div>

								<div className="col-lg-4 service-block-one">
									<div className="inner-box hvr-float-shadow">
										<h5>OPEN FOR ADMINS</h5>
										<h2>Employees</h2>

										<a href="/admin/employees" className="read-more">
											LIST OF EMPLOYEES +
										</a>

										<div className="icon">
											<span className="flaticon-brake-disc"></span>
										</div>
									</div>
								</div>

								<div className="col-lg-4 service-block-one">
									<div className="inner-box hvr-float-shadow">
										<h5>OPEN FOR ADMINS</h5>
										<h2>Add Employee</h2>

										<a href="/admin/add-employee" className="read-more">
											read more +
										</a>

										<div className="icon">
											<span className="flaticon-car-engine"></span>
										</div>
									</div>
								</div>

								<div className="col-lg-4 service-block-one">
									<div className="inner-box hvr-float-shadow">
										<h5>SERVICE AND REPAIRS</h5>
										<h2>Engine Servivice</h2>

										<a href="/admin/services" className="read-more">
											read more +
										</a>
										<div className="icon">
											<span className="flaticon-tire"></span>
										</div>
									</div>
								</div>

								<div className="col-lg-4 service-block-one">
									<div className="inner-box hvr-float-shadow">
										<h5>SERVICE AND REPAIRS</h5>
										<h2>Tyre and Wheels</h2>

										<a href="/admin/services" className="read-more">
											read more +
										</a>

										<div className="icon">
											<span className="flaticon-spray-gun"></span>
										</div>
									</div>
								</div>

								<div className="col-lg-4 service-block-one">
									<div className="inner-box hvr-float-shadow">
										<h5>SERVICE AND REPAIRS</h5>
										<h2>Denting</h2>

										<a href="/admin/services" className="read-more">
											read more +
										</a>

										<div className="icon">
											<span className="flaticon-spray-gun"></span>
										</div>
									</div>
								</div>

								<div className="col-lg-4 service-block-one">
									<div className="inner-box hvr-float-shadow">
										<h5>SERVICE AND REPAIRS</h5>
										<h2>Oil Change</h2>

										<a href="/admin/services" className="read-more">
											read more +
										</a>

										<div className="icon">
											<span className="flaticon-spray-gun"></span>
										</div>
									</div>
								</div>

								<div className="col-lg-4 service-block-one">
									<div className="inner-box hvr-float-shadow">
										<h5>SERVICE AND REPAIRS</h5>
										<h2>Brake Work</h2>

										<a href="/admin/services" className="read-more">
											read more +
										</a>

										<div className="icon">
											<span className="flaticon-spray-gun"></span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</section>
				</div>
			);
		} else if (isManager) {
			return (
				<div>
					<section className="services-section">
						<div className="auto-container">
							<div className="sec-title style-two">
								<h2>Manager Dashboard</h2>

								<div className="text">
									Bring to the table win-win survival strategies to ensure
									proactive domination. At the end of the day, going forward, a
									new normal that has evolved from generation X is on the runway
									heading towards a streamlined cloud solution.
								</div>
							</div>

							<div className="row">
								<div className="col-lg-4 service-block-one">
									<div className="inner-box hvr-float-shadow">
										<h5>OPEN FOR ALL</h5>
										<h2>All Orders</h2>

										<a href="/admin/orders" className="read-more">
											LIST OF ORDERS +
										</a>

										<div className="icon">
											<span className="flaticon-power"></span>
										</div>
									</div>
								</div>

								<div className="col-lg-4 service-block-one">
									<div className="inner-box hvr-float-shadow">
										<h5>OPEN FOR LEADS</h5>
										<h2>New Orders</h2>

										<a href="/admin/order" className="read-more">
											ADD ORDER+
										</a>

										<div className="icon">
											<span className="flaticon-gearbox"></span>
										</div>
									</div>
								</div>

								<div className="col-lg-4 service-block-one">
									<div className="inner-box hvr-float-shadow">
										<h5>SERVICE AND REPAIRS</h5>
										<h2>Engine Servivice</h2>
										<a href="/admin/services" className="read-more">
											read more +
										</a>
										<div className="icon">
											<span className="flaticon-tire"></span>
										</div>
									</div>
								</div>

								<div className="col-lg-4 service-block-one">
									<div className="inner-box hvr-float-shadow">
										<h5>SERVICE AND REPAIRS</h5>
										<h2>Tyre and Wheels</h2>

										<a href="/admin/services" className="read-more">
											read more +
										</a>

										<div className="icon">
											<span className="flaticon-spray-gun"></span>
										</div>
									</div>
								</div>

								<div className="col-lg-4 service-block-one">
									<div className="inner-box hvr-float-shadow">
										<h5>SERVICE AND REPAIRS</h5>
										<h2>Oil Change</h2>

										<a href="/admin/services" className="read-more">
											read more +
										</a>

										<div className="icon">
											<span className="flaticon-spray-gun"></span>
										</div>
									</div>
								</div>

								<div className="col-lg-4 service-block-one">
									<div className="inner-box hvr-float-shadow">
										<h5>SERVICE AND REPAIRS</h5>
										<h2>Brake Work</h2>

										<a href="/admin/services" className="read-more">
											read more +
										</a>

										<div className="icon">
											<span className="flaticon-spray-gun"></span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</section>
				</div>
			);
		}
	} else {
		return (
			<div>
				<LoginForm />
			</div>
		);
	}
}

export default Dashboard;
