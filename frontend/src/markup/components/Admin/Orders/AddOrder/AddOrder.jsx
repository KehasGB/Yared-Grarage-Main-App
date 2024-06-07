import React, { useEffect, useState } from "react";
import customerService from "../../../../../services/customer.service";
import CustomerVehicle from "../CustomerVehicle/CustomerVehicle";
import vehicleService from "../../../../../services/vehicle.service";
import SearchCustomer from "../SearchCustomer/SearchCustomer";
import { useAuth } from "../../../../../Contexts/AuthContext";

function AddOrder() {
	const [apiError, setApiError] = useState(false);
	const [apiErrorMessage, setApiErrorMessage] = useState(null);
	const [allCustomers, setAllCustomers] = useState([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [filterdCustomers, setFilteredCustomer] = useState([]);
	const [isCustomerSelected, setIsCustomerSelected] = useState(false);
	const [selectedCustomer, setSelectedCustomer] = useState({});
	const [customerVehicles, setCustomerVehicles] = useState([]);
	const { employee } = useAuth();
	useEffect(() => {
		let token = null;
		if (employee) {
			token = employee.employee_token;
		}
		// fetch all customers - later to be filtered
		const getCustomers = async () => {
			try {
				let response = await customerService.getAllCustomers(token);
				if (!response.ok) {
					// console.log(response.status);
					setApiError(true);
					if (response.status === 401) {
						setApiErrorMessage("Please login again");
					} else if (response.status === 403) {
						setApiErrorMessage("You are not authorized to view this page");
					} else {
						setApiErrorMessage("Please try again later");
					}
				} else {
					const data = await response.json();
					if (data.customers.length !== 0) {
						setAllCustomers(data.customers);
					}
				}
			} catch (error) {
				console.log(`Error: ${error}`);
			}
		};
		getCustomers();
	}, []);
	// console.log("fecthed customers:", allCustomers);
	// do the filter based on the search key word
	const handleInputChange = (event) => {
		setSearchQuery(event.target.value);
		const filteredCustomers = searchQuery
			? allCustomers.filter(
					(customer) =>
						customer.customer_first_name.includes(searchQuery) ||
						customer.customer_last_name.includes(searchQuery) ||
						customer.customer_email.includes(searchQuery) ||
						customer.customer_phone_number.includes(searchQuery)
			  )
			: [];
		// Display the filtered customer list or perform any other action
		// console.log("Filtered Customers:", filteredCustomers);
		setFilteredCustomer(filteredCustomers);
	};

	// function to manage if customer is selected or not
	const handleCustomerSelection = async (customer) => {
		setIsCustomerSelected(true);
		setSelectedCustomer(customer);
		// fetch customer vehicles using customer_id
		const response = await vehicleService.getVehiclesPerCustomer(
			customer.customer_id
		);
		const customerVehicle = await response.json();
		if (customerVehicle.status == "fail") {
			setCustomerVehicles([]);
		} else {
			setCustomerVehicles(customerVehicle);
		}
	};
	// console.log('customer before component:',selectedCustomer);

	return (
		<>
			{apiError ? (
				<section className="contact-section">
					<div className="auto-container">
						<div className="contact-title">
							<h2>{apiErrorMessage}</h2>
						</div>
					</div>
				</section>
			) : (
				<section className="contact-section">
					<div className="auto-container">
						<div className="contact-title">
							<h2>Creat a new order</h2>
						</div>
						{!isCustomerSelected ? (
							<>
								<SearchCustomer
									filterdCustomers={filterdCustomers}
									handleCustomerSelection={handleCustomerSelection}
									handleInputChange={handleInputChange}
									searchQuery={searchQuery}
								/>
							</>
						) : (
							<>
								<CustomerVehicle
									customer={selectedCustomer}
									vehicles={customerVehicles}
								/>
							</>
						)}
					</div>
				</section>
			)}
		</>
	);
}

export default AddOrder;
