import { useEffect, useContext, useState } from "react";
import {
	collection,
	query,
	where,
	onSnapshot,
	addDoc,
	Timestamp,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import authContext from "../contexts/authContext";
import OtherUser from "../components/OtherUser";
import MessageForm from "../components/MessageForm";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const Home = () => {
	// state definition to hold the array/list of other users, i.e users other than the autenthicated user
	const [otherUsers, setOtherUsers] = useState([]);
	const [chat, setChat] = useState(null);
	const [msgText, setMsgText] = useState("");
	const [payload, setPayload] = useState(null);

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
		// console.log(chat);
	};

	const handleSendMsg = async (e) => {
		e.preventDefault();
		// we will be creating another collection called "messages" to store conversations between users. Conversation between two users will have the same id(a combinaton of both their user ids)
		const combinedId =
			user.uid > chat.uid ? user.uid + chat.uid : chat.uid + user.uid;
		// console.log(combinedId);

		// initializing url to be assigned to the download url later on
		let url;
		if (payload) {
			const payloadRef = ref(
				storage,
				`payload/${new Date().getTime()} - ${payload.name}`
			);

			const snap = await uploadBytes(payloadRef, payload);
			const downloadUrl = await getDownloadURL(ref(storage, snap.ref.fullPath));
			url = downloadUrl;
			setPayload(null);
		}
		try {
			await addDoc(collection(db, "messages", combinedId, "chats"), {
				text: msgText,
				from: user.uid,
				to: chat.uid,
				createdAt: Timestamp.fromDate(new Date()),
				media: url || "",
			});
		} catch (err) {
			console.log(err.message);
		}
		setMsgText("");
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
								<>
									<div className="chat__container">
										<h3>{chat.name}</h3>
									</div>
									<MessageForm
										msgText={msgText}
										setMsgText={setMsgText}
										handleSendMsg={handleSendMsg}
										setPayload={setPayload}
									/>
								</>
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
