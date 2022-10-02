import { useEffect, useContext, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import authContext from "../contexts/authContext";
import OtherUser from "../components/OtherUser";

const Home = () => {
	// state definition to hold the array/list of other users, i.e users other than the autenthicated user
	const [otherUsers, setOtherUsers] = useState([]);
	const [chat, setChat] = useState(null);
	const { user } = useContext(authContext);
	useEffect(() => {
		if (user) {
			const q = query(
				collection(db, "users"),
				where("uid", "not-in", [user.uid])
			);
			const unsub = onSnapshot(q, (querySnapshot) => {
				let otherUsers = [];
				querySnapshot.forEach((doc) => {
					otherUsers.push(doc.data());
				});

				setOtherUsers(otherUsers);
			});
			return () => {
				unsub();
			};
		}
	}, [user]);

	// ===Event handler
	const selectUser = (selectedUser) => {
		setChat(selectedUser);
	};

	return (
		<div className="home_container">
			<div className="home_wrapper">
				{otherUsers.length > 0 ? (
					<>
						<div className="other_users">
							{otherUsers.map((otherUser, index) => {
								return (
									<OtherUser
										selectUser={selectUser}
										otherUser={otherUser}
										key={index}
									/>
								);
							})}
						</div>
						<div className="chats">
							{chat ? (
								<div className="chat__container">
									<h3>{chat.name}</h3>
								</div>
							) : (
								<div className="no_chat">
									Select a user to begin a conversation
								</div>
							)}
						</div>
					</>
				) : (
					<p>Loading . . .</p>
				)}
			</div>
		</div>
	);
};

export default Home;
