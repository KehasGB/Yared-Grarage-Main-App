import React, { useEffect, useState } from "react";
import logo from "../../../assets/images/yared.jpg";
// Import the custom context hook
import { useAuth } from "../../../Contexts/AuthContext";
// Import the login service to access the logout function
import loginService from "../../../services/login.service";

import { Link, useLocation } from "react-router-dom";

function Header() {
	const {
		isLogged,
		setIsLogged,
		isAdmin,
		setIsAdmin,
		isManager,
		setisManager,
		employee,
		isEmployee,
		setisEmployee,
		setEmployee,
	} = useAuth();
	const { pathname } = useLocation();

	// console.log(pathname);

	// Use the custom hook to access the data in the context

	const logOut = () => {
		// Call the logout function from the login service
		loginService.logOut();
		// Set the isLogged state to false
		setIsLogged(false);
		setIsAdmin(false);
		setisEmployee(false);
		setisManager(false);
		setisEmployee(false);
	};
	return (
		<div>
			<header className="main-header header-style-one">
				<div className="header-top">
					<div className="auto-container">
						<div className="inner-container">
							<div className="left-column">
								<div className="text">Enjoy the Beso while we fix your car</div>
								<div className="office-hour">
									Monday - Saturday 7:00AM - 6:00PM
								</div>
							</div>
							<div className="right-column">
								{!pathname.includes("/order-status/") ? (
									<>
										{isLogged ? (
											<div className="link-btn">
												<div className="phone-number">
													<strong>
														Welcome, {employee?.employee_first_name}
													</strong>
												</div>
											</div>
										) : (
											<div className="phone-number ">
												Schedule Appointment: <strong>+25187881470 </strong>
											</div>
										)}
									</>
								) : (
									<div className="phone-number mr-5">
										<strong>Welcome, Dear Guest</strong>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
				<div className="header-upper">
					<div className="auto-container">
						<div className="inner-container">
							<div className="logo-box">
								<div className="logo">
									<a href="/">
										<img src={logo} alt="" />
									</a>
								</div>
							</div>
							<div className="right-column">
								<div className="nav-outer">
									<div className="mobile-nav-toggler">
										<img src="assets/images/icons/icon-bar.png" alt="" />
									</div>
									<nav className="main-menu navbar-expand-md navbar-light">
										<div
											className="collapse navbar-collapse show clearfix"
											id="navbarSupportedContent"
										>
											<ul className="navigation">
												<li className="dropdown">
													<Link to="/">Home</Link>
												</li>
												<li className="dropdown">
													<Link to="/about">About Us</Link>
												</li>
												<li className="dropdown">
													<Link to="/services">Services</Link>
												</li>
												<li>
													<Link to="/contact">Contact Us</Link>
												</li>
												{!pathname.includes("/order-status/") && (
													<>
														{isAdmin ? (
															<li className="mr-5 ">
																<Link
																	className="text-primary"
																	to="/admin/dashboard"
																>
																	Admin
																</Link>
															</li>
														) : (
															""
														)}
														{isManager ? (
															<li className="mr-5">
																<Link
																	className="text-primary"
																	to="/managerlanding"
																>
																	Manager
																</Link>
															</li>
														) : (
															""
														)}
														{isEmployee ? (
															<li className="mr-5">
																<Link
																	className="text-primary"
																	to="/admin/orders"
																>
																	Orders
																</Link>
															</li>
														) : (
															""
														)}
													</>
												)}
											</ul>
										</div>
									</nav>
								</div>
								{!isLogged ? <div className="search-btn"></div> : ""}

								{!pathname.includes("/order-status/") && (
									<>
										{isLogged ? (
											<div className="link-btn">
												<Link
													to="/"
													className="theme-btn btn-style-one blue"
													onClick={logOut}
												>
													Log out
												</Link>
											</div>
										) : (
											<div className="link-btn">
												<Link to="/login" className="theme-btn btn-style-one">
													Login
												</Link>
											</div>
										)}
									</>
								)}
							</div>
						</div>
					</div>
				</div>
				<div className="sticky-header">
					<div className="header-upper">
						<div className="auto-container">
							<div className="inner-container">
								<div className="logo-box">
									<div className="logo">
										<Link to="/">
											<img src="assets/images/custom/logo.png" alt="" />
										</Link>
									</div>
								</div>
								<div className="right-column">
									<div className="nav-outer">
										<div className="mobile-nav-toggler">
											<img src="assets/images/icons/icon-bar.png" alt="" />
										</div>

										<nav className="main-menu navbar-expand-md navbar-light"></nav>
									</div>
									<div className="search-btn"></div>
									<div className="link-btn">
										<Link to="/login" className="theme-btn btn-style-one">
											Login
										</Link>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="mobile-menu">
					<div className="menu-backdrop"></div>
					<div className="close-btn">
						<span className="icon flaticon-remove"></span>
					</div>

					<nav className="menu-box">
						<div className="nav-logo">
							<Link to="#">
								<img src="assets/images/logo-two.png" alt="" title="" />
							</Link>
						</div>
						<div className="menu-outer"></div>
					</nav>
				</div>

				<div className="nav-overlay">
					<div className="cursor"></div>
					<div className="cursor-follower"></div>
				</div>
			</header>
		</div>
	);
}

export default Header;
