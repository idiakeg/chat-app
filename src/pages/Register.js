import { useContext } from "react";
import authContext from "../contexts/authContext";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc, Timestamp } from "firebase/firestore";

const Register = () => {
	const { name, email, password, error, loading, data, setData, handleChange } =
		useContext(authContext);

	// =====Use Navigate / history definitions======
	const history = useNavigate();

	// ======= Event Handlers======

	// ->Handle Submit
	const handleSubmit = async (e) => {
		e.preventDefault();

		setData({
			...data,
			error: null,
			loading: true,
		});

		if (name === "" || password === "" || email === "") {
			setData({
				...data,
				error: "All fields are required!",
			});
		}

		try {
			const result = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);

			await setDoc(doc(db, "users", result.user.uid), {
				name,
				email,
				uid: result.user.uid,
				createdAt: Timestamp.fromDate(new Date()),
				isOnline: true,
			});

			setData({
				name: "",
				email: "",
				password: "",
				error: null,
				loading: false,
			});

			history("/");
		} catch (error) {
			console.log(error);
			setData({
				...data,
				error: error.message,
			});
		}
	};

	return (
		<div className="route__container">
			{loading ? (
				<p>Loading...</p>
			) : (
				<section>
					<h3>Create Account</h3>
					<form onSubmit={handleSubmit}>
						<div className="input_group">
							<label htmlFor="name">Name</label>
							<input
								name="name"
								type="text"
								value={name}
								onChange={handleChange}
							/>
						</div>
						<div className="input_group">
							<label htmlFor="email">Email</label>
							<input
								name="email"
								type="email"
								value={email}
								onChange={handleChange}
							/>
						</div>
						<div className="input_group">
							<label htmlFor="password">Password</label>
							<input
								name="password"
								type="password"
								value={password}
								onChange={handleChange}
							/>
						</div>
						{error && <p className="error">{error}</p>}
						<button disabled={loading} type="submit">
							{loading ? "Creating..." : "Register"}
						</button>
					</form>
				</section>
			)}
		</div>
	);
};

export default Register;
