import React from "react";
import ServiceEdit from "../../components/Admin/ServiceEdit/ServiceEdit";
import AdminMenu from "../../components/Admin/AdminMenu/AdminMenu";

function ServiceUpdate() {
	return (
		<div>
			<div className="container-fluid admin-pages">
				<div className="row">
					<div className="col-md-3 admin-left-side">
						<AdminMenu />
					</div>

					<div className="col-md-9 admin-right-side">
						<ServiceEdit />
					</div>
				</div>
			</div>
		</div>
	);
}

export default ServiceUpdate;
