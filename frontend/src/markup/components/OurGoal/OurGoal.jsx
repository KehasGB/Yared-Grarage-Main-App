import React from 'react'
import carDashboard from "../../../assets/images/home/car-dashboard_.jpg";
function OurGoal() {
  return (
		<div>
			<section className="why-choose-us-two">
				<div className="auto-container">
					<div className="row no-gutters">
						<div className="col-xl-6 left-column">
							<div className="inner-container">
								<div className="sec-title style-two light">
									<h2>
										Quality Service And <br />
										Customer Satisfaction !!
									</h2>
								</div>
								<div className="icon-box">
									<div>
										<div className="text">
											We utilize the most recent symptomatic gear to ensure your
											vehicle is fixed or adjusted appropriately and in an
											opportune manner. We are an individual from Professional
											Auto Service, a first class execution arrange, where free
											assistance offices share shared objectives of being
											world-class car administration focuses.
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="col-xl-6 right-column">
							<img src={carDashboard} alt="" />
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}

export default OurGoal