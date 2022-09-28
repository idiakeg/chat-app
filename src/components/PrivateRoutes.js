import { Navigate, Outlet } from "react-router-dom";

const PrivateRoutes = () => {
	let det = JSON.parse(localStorage.getItem("isLoggedIn"));

	return det ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
