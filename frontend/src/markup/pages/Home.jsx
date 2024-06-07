import React from 'react'
import topBackgroundImage from "../../assets/images/banner/banner.jpg"; 
import bottomBackgroundImage from "../../assets/images/home/car-motor-2.jpg";
import About from "../components/About/About";
import Banner from "../components/Banner/Banner";
import OurServices from "../components/OurServices/OurServices";
import ChooseUs from "../components/ChooseUs/ChooseUs";
import Appointment from "../components/Appointment/Appointment";
import OurGoal from '../components/OurGoal/OurGoal';
function Home() {
  return (
		<div>
			<Banner backgroundImage={topBackgroundImage} />
			<About />
			<OurServices />
			<OurGoal/>
			<ChooseUs />
			<Banner backgroundImage={bottomBackgroundImage} />
			<Appointment />
		</div>
	);
}

export default Home