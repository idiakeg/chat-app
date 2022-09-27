import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import authContext from "../contexts/authContext";
import { useContext } from "react";

const Login = () => {
	const history = useNavigate();

	const { handleChange, data, email, password, error, loading, setData } =
		useContext(authContext);

	const handleSubmit = async (e) => {
		e.preventDefault();

		setData({
			...data,
			error: null,
			loading: true,
		});

		if (password === "" || email === "") {
			setData({
				...data,
				error: "All fields are required!",
			});
			return;
		}

		try {
			const result = await signInWithEmailAndPassword(auth, email, password);

			await updateDoc(doc(db, "users", result.user.uid), {
				isOnline: true,
			});

			setData({
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
				<p>Loading ...</p>
			) : (
				<section>
					<h3>Login to your Account</h3>
					<form onSubmit={handleSubmit}>
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
							{loading ? "Loging in..." : "Login"}
						</button>
					</form>
				</section>
			)}
		</div>
	);
};

export default Login;
