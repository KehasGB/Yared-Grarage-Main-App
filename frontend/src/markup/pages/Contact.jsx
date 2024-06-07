import React from "react";
import Contactus from "../components/Contactus/Contactus";
import Appointment from "../components/Appointment/Appointment";
import ContactBanner from "../components/ContactBanner/ContactBanner"

function Contact() {
	return (
		<div>
			<ContactBanner />
			<Contactus />
			<Appointment />
		</div>
	);
}

export default Contact;
