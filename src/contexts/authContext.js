import { useEffect, useState } from "react";
import { createContext } from "react";
import { auth } from "../firebase";

import { onAuthStateChanged } from "firebase/auth";

const authContext = createContext();

export const AuthProvider = ({ children }) => {
	//======= Use state definitions=======
	const [user, setUser] = useState(null);
	const [data, setData] = useState({
		name: "",
		email: "",
		password: "",
		error: null,
		loading: false,
	});
	const { name, email, password, error, loading } = data;

	// =====Use Effect definitions=====
	useEffect(() => {
		const unsub = onAuthStateChanged(auth, (data) => {
			setUser(data);
			if (data) {
				localStorage.setItem("isLoggedIn", true);
			}
		});
		return () => {
			unsub();
		};
	}, []);

	// =====Event Handlers=====

	// -->Handle Change
	const handleChange = (e) => {
		setData({
			...data,
			[e.target.name]: e.target.value,
		});
	};

	return (
		<authContext.Provider
			value={{
				user,
				data,
				name,
				email,
				password,
				error,
				loading,
				setData,
				handleChange,
			}}
		>
			{children}
		</authContext.Provider>
	);
};

export default authContext;
