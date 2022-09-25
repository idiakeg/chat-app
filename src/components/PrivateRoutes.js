import { useContext } from "react";
import authContext from "../contexts/authContext";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoutes = () => {
	const { user } = useContext(authContext);
	return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
