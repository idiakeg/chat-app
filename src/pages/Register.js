import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc, Timestamp } from "firebase/firestore";

const Register = () => {
	const [data, setData] = useState({
		name: "",
		email: "",
		password: "",
		error: null,
		loading: false,
	});

	const { name, email, password, error, loading } = data;

	const history = useNavigate();

	const handleChange = (e) => {
		setData({
			...data,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		// we are setting the loading state to true here, this will come in handy if we ever decide to include a spinner
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

			// After authentication, redrect the user to the home page
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
						Register
					</button>
				</form>
			</section>
		</div>
	);
};

export default Register;
