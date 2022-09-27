import { useEffect, useState } from "react";
import { createContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

const authContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);

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

	return (
		<authContext.Provider value={{ user }}>{children}</authContext.Provider>
	);
};

export default authContext;
