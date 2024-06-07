import React from 'react'
import OurServices from "../components/OurServices/OurServices";
import ChooseUs from "../components/ChooseUs/ChooseUs";
import Banner from "../components/Banner/Banner";
import bottomBackgroundImage from "../../assets/images/home/car-engine.jpg";
import Appointment from "../components/Appointment/Appointment";
import ServiceBanner from "../components/ServiceBanner/ServiceBanner";
function ServicesPublic() {
  return (
		<div>
			<ServiceBanner />
			<OurServices />
			<ChooseUs />
			<Banner backgroundImage={bottomBackgroundImage} />
			<Appointment />
		</div>
	);
}

export default ServicesPublic