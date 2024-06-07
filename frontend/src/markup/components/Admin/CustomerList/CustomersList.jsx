import React, { useState, useEffect } from "react";
import { Table, Modal, Button } from "react-bootstrap";
import { useAuth } from "../../../../Contexts/AuthContext";
import { format } from "date-fns";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FaEdit } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import {
	faSearch,
	faAngleDoubleLeft,
	faAngleLeft,
	faAngleRight,
	faAngleDoubleRight,
} from "@fortawesome/free-solid-svg-icons";
import customerServices from "../../../../services/customer.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Link, useNavigate } from "react-router-dom";

const CustomersList = () => {
	const [showModal, setShowModal] = useState(false);
	const [customers, setCustomers] = useState([]);
	const [apiError, setApiError] = useState(false);
	const [apiErrorMessage, setApiErrorMessage] = useState(null);
	const { employee, customer } = useAuth();
	let token = null;
	const [selectedCustomer, setSelectedCustomer] = useState(null);
	const [showActiveConfirmation, setShowActiveConfirmation] = useState(false);
	const navigate = useNavigate();
	const [searchTerm, setSearchTerm] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const pageSize = 5; // Set the desired number of records per page
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	if (employee) {
		token = employee.employee_token;
	}
	const getCustomers = async () => {
		try {
			const response = await customerServices.getAllCustomers(token);

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
				setTotalPages(Math.ceil(data.customers.length / pageSize));

				// Filter customers based on pagination
				const start = (currentPage - 1) * pageSize;
				const end = start + pageSize;
				const paginatedCustomers = data.customers.slice(start, end);
				setCustomers(paginatedCustomers);
			}
		} catch (err) {
			console.log(err);
		}
	};
	useEffect(() => {
		getCustomers();
	}, [token, currentPage]);

	const handleFirstClick = () => {
		// console.log("Handling First Click");
		setCurrentPage(1);
	};

	const handlePreviousClick = () => {
		// console.log("Handling Previous Click");
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1);
		}
	};

	const handleNextClick = () => {
		// console.log("Handling Next Click");
		if (currentPage < totalPages) {
			setCurrentPage(currentPage + 1);
		}
	};

	const handleLastClick = () => {
		// console.log("Handling Last Click");
		setCurrentPage(totalPages);
	};

	const handleSearch = (event) => {
		const searchTerm = event.target.value.toLowerCase();
		setSearchTerm(searchTerm);
		if (!searchTerm || searchTerm.trim() === "") {
			setSearchResults([]);
		} else {
			const filteredCustomers = customers.filter((customer) => {
				const firstName =
					(customer?.customer_first_name || "").toLowerCase() || "";
				const lastName =
					(customer?.customer_last_name || "").toLowerCase() || "";
				const email = (customer?.customer_email || "").toLowerCase() || "";
				const phone =
					(customer?.customer_phone_number || "").toLowerCase() || "";
				return (
					firstName.includes(searchTerm) ||
					lastName.includes(searchTerm) ||
					email.includes(searchTerm) ||
					phone.includes(searchTerm)
				);
			});
			setSearchResults(filteredCustomers);
		}
	};

	const handleActiveClick = (customer) => {
		setSelectedCustomer(customer);
		setShowActiveConfirmation(true);
	};

	const handleConfirmActive = () => {
		if (selectedCustomer) {
			// console.log(selectedCustomer);
			const updatedCustomers = customers.map((customer) =>
				customer.customer_id === selectedCustomer.customer_id
					? {
							...customer,
							active_customer_status:
								customer.active_customer_status === 1 ? 0 : 1,
					  }
					: customer
			);
			// setCustomers(updatedCustomers);

			const newCustomerData = {
				...selectedCustomer,
				active_customer_status:
					selectedCustomer.active_customer_status === 1 ? 0 : 1,
			};
			// console.log("customer to update:", newCustomerData);
			const customerValue = {
				customer_first_name: newCustomerData.customer_first_name,
				customer_last_name: newCustomerData.customer_last_name,
				customer_phone_number: newCustomerData.customer_phone_number,
				active_customer_status: newCustomerData.active_customer_status,
				customer_email: newCustomerData.customer_email,
			};
			// send the new customer value for update
			const updateCustomer = customerServices.updateCustomer(
				newCustomerData.customer_id,
				customerValue,
				token
			);
			updateCustomer.then((response) => {
				if (response.ok) {
					setCustomers(updatedCustomers);
				}
			});

		}

		// Close the modal and reset selectedCustomer
		setShowActiveConfirmation(false);
		setSelectedCustomer(null);
	};

	const handleCancelActive = () => {
		setShowActiveConfirmation(false);
	};

	return (
		<>
			<Modal show={showActiveConfirmation} onHide={handleCancelActive}>
				<Modal.Header closeButton>
					<Modal.Title>Confirm Active Status</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					Are you sure you want to change the active status?
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleCancelActive}>
						Cancel
					</Button>
					<Button variant="primary" onClick={handleConfirmActive}>
						Confirm
					</Button>
				</Modal.Footer>
			</Modal>
			{apiError ? (
				<section className="contact-section">
					<div className="auto-container">
						<div className="contact-title">
							<h2>{apiErrorMessage}</h2>
						</div>
					</div>
				</section>
			) : (
				<>
					<section className="contact-section">
						<div className="auto-container">
							<div className="contact-title">
								<h2>Customers</h2>
							</div>
							<div style={{ position: "relative", display: "flex" }}>
								<input
									type="text"
									value={searchTerm}
									onChange={handleSearch}
									placeholder="Search for customers using first name, last name, email, or phone number..."
									style={{ width: "100%", height: "40px" }}
								/>
								<FontAwesomeIcon
									icon={faSearch}
									onClick={handleSearch}
									style={{
										position: "absolute",
										right: "8px",
										top: "50%",
										transform: "translateY(-50%)",
										cursor: "pointer",
									}}
								/>
							</div>
							<br />
							<Table striped bordered hover>
								<thead>
									<tr>
										<th>ID</th>
										<th>First Name</th>
										<th>Last Name</th>
										<th>Email</th>
										<th>Phone Number</th>
										<th>Added Date</th>
										<th>Active</th>
										<th>Edit</th>
									</tr>
								</thead>
								<tbody>
									{searchResults.length > 0
										? searchResults.map((customer) => (
												<tr key={customer.customer_id}>
													<td>{customer.customer_id}</td>
													<td>{customer.customer_first_name}</td>
													<td>{customer.customer_last_name}</td>
													<td>{customer.customer_email}</td>
													<td>{customer.customer_phone_number}</td>
													<td>{customer.customer_added_date}</td>
													<td>
														<Button
															variant={
																customer.active_customer_status === 1
																	? "success"
																	: "danger"
															}
															onClick={() => handleActiveClick(customer)}
														>
															{customer.active_customer_status === 1
																? "Yes"
																: "No"}
														</Button>
													</td>
													<td>
														<div className="edit-delete-icons">
															<Link
																to={`/admin/customer/edit/${customer.customer_id}`}
															>
																<FaEdit />
															</Link>{" "}
															|{" "}
															<Link
																to={`/admin/customer-profile/${customer.customer_id}`}
															>
																<FiExternalLink />
															</Link>
														</div>
													</td>
												</tr>
										  ))
										: customers.map((customer) => (
												<tr key={customer.customer_id}>
													<td>{customer.customer_id}</td>
													<td>{customer.customer_first_name}</td>
													<td>{customer.customer_last_name}</td>
													<td>{customer.customer_email}</td>
													<td>{customer.customer_phone_number}</td>
													<td>{customer.customer_added_date}</td>
													<td>
														<Button
															variant={
																customer.active_customer_status === 1
																	? "success"
																	: "danger"
															}
															onClick={() => handleActiveClick(customer)}
														>
															{customer.active_customer_status === 1
																? "Yes"
																: "No"}
														</Button>
													</td>
													<td>
														<div className="edit-delete-icons">
															<Link
																to={`/admin/customer/edit/${customer.customer_id}`}
															>
																<FaEdit />
															</Link>{" "}
															|{" "}
															<Link
																to={`/admin/customer-profile/${customer.customer_id}`}
															>
																<FiExternalLink />
															</Link>
														</div>
													</td>
												</tr>
										  ))}
								</tbody>
							</Table>
						</div>
					</section>
					<div
						style={{
							display: "flex",
							justifyContent: "center",
							marginBottom: "20px",
							alignItems: "center", // Centering vertically
						}}
					>
						<button
							onClick={handleFirstClick}
							disabled={currentPage === 1}
							style={{ marginRight: "10px" }}
						>
							<FontAwesomeIcon icon={faAngleDoubleLeft} /> First
						</button>
						<button
							onClick={handlePreviousClick}
							disabled={currentPage === 1}
							style={{ marginRight: "10px" }}
						>
							<FontAwesomeIcon icon={faAngleLeft} /> Previous
						</button>
						<span style={{ margin: "0 10px" }}>
							Page {currentPage} of {totalPages}
						</span>
						<button
							onClick={handleNextClick}
							disabled={currentPage === totalPages}
							style={{
								marginRight: "10px",
							}}
						>
							Next <FontAwesomeIcon icon={faAngleRight} />
						</button>
						<button
							onClick={handleLastClick}
							disabled={currentPage === totalPages}
						>
							Last <FontAwesomeIcon icon={faAngleDoubleRight} />
						</button>
					</div>
				</>
			)}
		</>
	);
};

export default CustomersList;
