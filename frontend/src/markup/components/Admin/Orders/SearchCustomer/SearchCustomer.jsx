import React from 'react'
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaHandPointer } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faSearch,
	faAngleDoubleLeft,
	faAngleLeft,
	faAngleRight,
	faAngleDoubleRight,
} from "@fortawesome/free-solid-svg-icons";
function SearchCustomer({
	filterdCustomers,
	handleCustomerSelection,
	handleInputChange,
	searchQuery,
}) {
	
	return (
		<>
			<div className=" clearfix">
				<div className="form-column ">
					<div className="inner-column">
						<div className="contact-form">
							<form>
								<div className="row clearfix">
									<div
										className="form-group col-md-12 "
										style={{ position: "relative", display: "flex" }}
									>
										<input
											type="text"
											placeholder="Search for a customer using first name, last name, email address,  or phone number."
											value={searchQuery}
											onChange={handleInputChange}
										/>
										<FontAwesomeIcon
											icon={faSearch}
											style={{
												position: "absolute",
												right: "20px",
												top: "50%",
												transform: "translateY(-50%)",
												cursor: "pointer",
											}}
										/>
									</div>

									<div className="form-group col-md-12">
										<Link
											to={"/admin/add-customer"}
											className="theme-btn btn-style-one"
											type="submit"
											data-loading-text="Please wait..."
										>
											<span>Add New Customer</span>
										</Link>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>

			{/*  Displaying the customer list */}
			<Table striped bordered hover>
				<thead>
					<tr></tr>
				</thead>
				<tbody>
					{filterdCustomers?.map((customer) => (
						<tr key={customer.customer_id}>
							<td>{customer.customer_first_name}</td>
							<td>{customer.customer_last_name}</td>

							<td>{customer.customer_email}</td>
							<td>{customer.customer_phone_number}</td>
							<td>
								<div className="edit-delete-icons">
									<Link
										to="#"
										onClick={() => {
											handleCustomerSelection(customer);
										}}
									>
										<FaHandPointer />
									</Link>
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</Table>
		</>
	);
}

export default SearchCustomer