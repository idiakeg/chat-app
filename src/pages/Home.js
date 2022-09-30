import { useEffect, useContext } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import authContext from "../contexts/authContext";

const Home = () => {
	const { user } = useContext(authContext);
	useEffect(() => {
		if (user) {
			const q = query(
				collection(db, "users"),
				where("uid", "not-in", [user.uid])
			);
			// this runs just once and can be fine for other usage but i'd like to use a listener
			getDocs(q)
				.then((snapShot) => {
					snapShot.docs.forEach((doc) => {
						console.log(doc.data().uid);
					});
				})
				.catch((err) => console.log(err.message));
		} else {
			console.log("No authenticated user");
		}
	}, [user]);

	return <div>Home</div>;
};

export default Home;
