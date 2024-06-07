import React from "react";
import backgroundImage from "../../../assets/images/services/service-banner.jpg";
import { Link } from "react-router-dom";
function ServiceBanner() {
	// inserting bg image
	const divStyle = {
		backgroundImage: `url(${backgroundImage})`,
		backgroundRepeat: "no-repeat",
		backgroundSize: "cover",
	};
	return (
		<section className="page-title" style={divStyle}>
			<div className="auto-container">
				<h2>Services</h2>
				<ul className="page-breadcrumb">
					<li>
						<Link to="/">home</Link>
					</li>
					<li>Services</li>
				</ul>
			</div>
		</section>
	);
}

export default ServiceBanner;
