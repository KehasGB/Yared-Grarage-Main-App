import React from 'react'
import vban1 from '../../../assets/images/about/vban1.jpg'
import vban2 from "../../../assets/images/about/vban2.jpg";
import { Link } from 'react-router-dom';
function About() {
  return (
		<div>
			<section className="about-section">
				<div className="auto-container">
					<div className="row">
						<div className="col-lg-5">
							<div className="image-box">
								<img src={vban1} alt="" />
								<img src={vban2} alt="" />
								<div className="year-experience" data-parallax='{"y": 30}'>
									<strong>10</strong> years <br />
									Experience
								</div>
							</div>
						</div>
						<div className="col-lg-7 pl-lg-5">
							<div className="sec-title">
								<h5>Welcome to Our workshop</h5>
								<h2>We have 10 years experience</h2>
								<div className="text">
									<p>
									Yared Garage offers unparalleled automotive service, dedicated to ensuring your vehicle remains in optimal condition mile after mile. From routine maintenance to complex repairs, our skilled professionals prioritize reliability and transparency to guarantee your satisfaction.
									</p>
									<p>
									We understand the importance of trust and transparency in the automotive industry. That's why at Yared Garage, we provide clear communication, honest recommendations, and fair pricing to every customer. When you choose Yared Garage, you're choosing peace of mind knowing that your car is in the hands of experienced professionals who are passionate about keeping you safely on the road. Welcome to Yared Garage, where your car's well-being is our foremost concern.
									</p>
								</div>
								<div className="link-btn mt-40">
									<Link
										to="about"
										className="theme-btn btn-style-one style-two"
									>
										<span>
											About Us <i className="flaticon-right"></i>
										</span>
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}

export default About