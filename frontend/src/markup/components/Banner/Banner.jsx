import React from "react";
function Banner({ backgroundImage }) {
	// inserting bg image
	const divStyle = {
		backgroundImage: `url(${backgroundImage})`, // Set the background image
		backgroundRepeat: "no-repeat",
		backgroundSize: "cover",
	};
	return (
		<div>
			<section className="video-section">
				<div
					data-parallax='{"y": 50}'
					className="sec-bg"
					style={divStyle}
				></div>
				<div className="auto-container">
					<h5>Working since 2014</h5>
					<h2>
						Tuneup Your Car <br />
						to Next Level
					</h2>
					<div className="video-box">
						<div className="video-btn">
							<a
								href="#"
								className="overlay-link lightbox-image video-fancybox ripple"
							>
								<i className="flaticon-play"></i>
							</a>
						</div>
						<div className="text">
							Watch intro video <br />
							about us
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}

export default Banner;
