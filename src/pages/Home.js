import { useEffect, useContext, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import authContext from "../contexts/authContext";

const Home = () => {
	// state definition to hold the array/list of other users, i.e users other than the autenthicated user
	const [otherUsers, setOtherUsers] = useState([]);
	const { user } = useContext(authContext);
	useEffect(() => {
		if (user) {
			const q = query(
				collection(db, "users"),
				where("uid", "not-in", [user.uid])
			);
			//this method uses a listener so whenever there is a change to the users collection, the data obtained is updated
			const unsub = onSnapshot(q, (querySnapshot) => {
				// initialize an empty array that will eventually hold the data obtained
				let otherUsers = [];
				// loop over the querysnapshot and for each doc obtained, push it into the otherUSers array
				querySnapshot.forEach((doc) => {
					otherUsers.push(doc.data());
				});

				setOtherUsers(otherUsers);
			});
			// unsubscribing to the listener to prevent memory leaks
			return () => {
				unsub();
			};
		}
	}, [user]);

	console.log(otherUsers);

	return <div>Home</div>;
};

export default Home;
