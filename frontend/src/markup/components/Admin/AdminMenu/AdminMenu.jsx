import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../../Contexts/AuthContext";
import LoginForm from "../../LoginForm/LoginForm";
function AdminMenu(props) {
	const { isLogged, isAdmin, isManager } = useAuth();

	if (isLogged) {
		// console.log("Kebede");

		if (isAdmin) {
			return (
				<div>
					<div className="admin-menu">
						<h2>Admin Menu</h2>
					</div>
					<div className="list-group">
						<Link to="/admin/dashboard" className="list-group-item">
							Dashboard
						</Link>
						<Link to="/admin/orders" className="list-group-item">
							Orders
						</Link>
						<Link to="/admin/order" className="list-group-item">
							New order
						</Link>
						<Link to="/admin/add-employee" className="list-group-item">
							Add employee
						</Link>
						<Link to="/admin/employees" className="list-group-item">
							Employees
						</Link>
						<Link to="/admin/add-customer" className="list-group-item">
							Add customer
						</Link>
						<Link to="/admin/customers" className="list-group-item">
							Customers
						</Link>
						<Link to="/admin/services" className="list-group-item">
							Services
						</Link>
					</div>
				</div>
			);
		} else if (isManager) {
			return (
				<div>
					<div className="admin-menu">
						<h2>Manager Menu</h2>
					</div>
					<div className="list-group">
						<Link to="/managerlanding" className="list-group-item">
							Dashboard
						</Link>
						<Link to="/admin/orders" className="list-group-item">
							Orders
						</Link>
						<Link to="/admin/order" className="list-group-item">
							New order
						</Link>
						<Link to="/admin/add-customer" className="list-group-item">
							Add customer
						</Link>
						<Link to="/admin/customers" className="list-group-item">
							Customers
						</Link>
						<Link to="/admin/services" className="list-group-item">
							Services
						</Link>
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

export default AdminMenu;
