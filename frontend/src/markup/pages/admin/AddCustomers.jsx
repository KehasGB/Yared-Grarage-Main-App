
import React from "react";
import AddNewCustomer from "../../components/Admin/AddCustomer/AddNewCustomer";
import AdminMenu from "../../components/Admin/AdminMenu/AdminMenu";

function Customers(props) {
	return (
		<div>
			<div className="container-fluid admin-pages">
				<div className="row">
					<div className="col-md-3 admin-left-side">
						<AdminMenu />
					</div>
					<div className="col-md-9 admin-right-side">
						<AddNewCustomer />
					</div>
				
				</div>
			</div>
		</div>
	);
}

export default Customers;
