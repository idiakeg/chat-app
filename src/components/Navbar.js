import { Link } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useContext } from "react";
import authContext from "../contexts/authContext";

const Navbar = () => {
	const { user } = useContext(authContext);

	const handleLogOut = async () => {
		// when we log out the user, we want to update the user's online status to false aswell
		updateDoc(doc(db, "users", auth.currentUser.uid), {
			isOnline: false,
		});
		signOut(auth);
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
