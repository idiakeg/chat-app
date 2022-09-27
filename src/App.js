import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import PrivateRoutes from "./components/PrivateRoutes";
import Profile from "./pages/Profile";
import { AuthProvider } from "./contexts/authContext";

function App() {
	return (
		<AuthProvider>
			<BrowserRouter>
				<Navbar />
				<Routes>
					<Route element={<PrivateRoutes />}>
						<Route path="/" element={<Home />} />
						<Route path="/profile" element={<Profile />} />
					</Route>
					<Route path="/register" element={<Register />} />
					<Route path="/login" element={<Login />} />
				</Routes>
			</BrowserRouter>
		</AuthProvider>
	);
}

export default App;
