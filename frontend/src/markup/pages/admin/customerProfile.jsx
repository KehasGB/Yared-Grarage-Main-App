import React from "react";
// Import the auth hook
import { useAuth } from "../../../Contexts/AuthContext";
// Import the login form component
import LoginForm from "../../components/LoginForm/LoginForm";
// Import the admin menu component
import AdminMenu from "../../components/Admin/AdminMenu/AdminMenu";
// Import the OrdersList component
import CostomerProfileForm from "../../components/Admin/CostomerProfile/CostomerProfileForm";
function CustomerProfile() {
	// Destructure the auth hook
	const { isLogged, isAdmin, isManager } = useAuth();

	if (isLogged) {
		// console.log("Kebede");

		if (isAdmin || isManager) {
			return (
				<div>
					<div className="container-fluid admin-pages">
						<div className="row">
							<div className="col-md-3 admin-left-side">
								<AdminMenu />
							</div>
							<div className="col-md-9 admin-right-side">
								<CostomerProfileForm />
							</div>
						</div>
					</div>
				</div>
			);
		} else {
			return (
				<div className="mt-5 ml-5">
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

export default CustomerProfile;

