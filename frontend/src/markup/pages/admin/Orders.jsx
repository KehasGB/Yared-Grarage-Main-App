import React from "react";
// Import the auth hook
import { useAuth } from "../../../Contexts/AuthContext";
// Import the login form component
import LoginForm from "../../components/LoginForm/LoginForm";
// Import the admin menu component
import AdminMenu from "../../components/Admin/AdminMenu/AdminMenu";
// Import the OrdersList component
import OrdersList from "../../components/Admin/Orders/OrdersList/OrdersList";
function Orders() {
	// Destructure the auth hook
	const { isLogged, isAdmin, isManager } = useAuth();

	if (isLogged) {
		// console.log("Kebede");

		if (isAdmin||isManager) {
			return (
				<div>
					<div className="container-fluid admin-pages">
						<div className="row">
							<div className="col-md-3 admin-left-side">
								<AdminMenu />
							</div>
							<div className="col-md-9 admin-right-side">
								<OrdersList />
							</div>
						</div>
					</div>
				</div>
			);
		} else {
			return (
				<div className="mt-5 ml-5">
					<h1>Welcome Employees all orders are shown below</h1>
					<div>
						<OrdersList />
					</div>
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

export default Orders;
