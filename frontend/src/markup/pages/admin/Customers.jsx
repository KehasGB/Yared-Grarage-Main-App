import React from "react";
import { useAuth } from "../../../Contexts/AuthContext";
import LoginForm from "../../components/LoginForm/LoginForm";
import CustomersList from "../../components/Admin/CustomerList/CustomersList";
import AdminMenu from "../../components/Admin/AdminMenu/AdminMenu";

function Customers() {
	const { isLogged, isAdmin, isManager } = useAuth();

	if (isLogged) {
		// console.log("Test22");
		if (isAdmin || isManager) {
			return (
				<div>
					<div className="container-fluid admin-pages">
						<div className="row">
							<div className="col-md-3 admin-left-side">
								<AdminMenu />
							</div>
							<div className="col-md-9 admin-right-side">
								<CustomersList />
							</div>
						</div>
					</div>
				</div>
			);
		} else {
			return (
				<div>
					<h1>You are not authorized to access this page</h1>
				</div>
			);
		}
	} else {
		return (
			<div>
				<LoginForm />
			</div>
		);
	}
}

export default Customers;


