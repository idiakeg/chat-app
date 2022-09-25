import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useContext } from "react";
import authContext from "../contexts/authContext";

const Navbar = () => {
	const { user } = useContext(authContext);

	const history = useNavigate();

	const handleLogOut = async () => {
		await updateDoc(doc(db, "users", auth.currentUser.uid), {
			isOnline: false,
		});
		await signOut(auth);
		// redirecting user to login page
		history("/login");
	};

	return (
		<nav>
			<h3>
				<Link to="/">ChatApp</Link>{" "}
			</h3>
			<div>
				{user ? (
					<>
						<Link to="/profile">Profile</Link>
						<button onClick={handleLogOut}>Logout</button>
					</>
				) : (
					<>
						<Link to="/register">Register</Link>
						<Link to="/login">Login</Link>
					</>
				)}
			</div>
		</nav>
	);
};

export default Navbar;
