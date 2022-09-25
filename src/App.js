import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import PrivateRoutes from "./components/PrivateRoutes";

function App() {
	return (
		<BrowserRouter>
			<Navbar />
			<Routes>
				<Route element={<PrivateRoutes />}>
					<Route path="/" element={<Home />} />
				</Route>
				<Route path="/register" element={<Register />} />
				<Route path="/login" element={<Login />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;

// Upon launching the app, users that are not logged in will be shown the login page because the home page is a private route that is only available to loged in users.
