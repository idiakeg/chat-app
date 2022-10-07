import { useEffect, useContext, useState } from "react";
import {
	collection,
	query,
	where,
	onSnapshot,
	addDoc,
	Timestamp,
	orderBy,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import authContext from "../contexts/authContext";
import OtherUser from "../components/OtherUser";
import MessageForm from "../components/MessageForm";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Message from "../components/Message";

const Home = () => {
	const [otherUsers, setOtherUsers] = useState([]);
	const [chat, setChat] = useState(null);
	const [msgText, setMsgText] = useState("");
	const [payload, setPayload] = useState(null);
	const [msgCollection, setMsgCollection] = useState([]);

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
		// upon selecting the user, we would like to also obtain the messages sent and stored in firebase
		if (user) {
			// the selectedUser.uid is used here instead of the chat.uid because pf the async nature of the setState call.
			const combinedId =
				user.uid > selectedUser.uid
					? user.uid + selectedUser.uid
					: selectedUser.uid + user.uid;

			const msgsRef = collection(db, "messages", combinedId, "chats");
			const q = query(msgsRef, orderBy("createdAt", "asc"));
			onSnapshot(q, (docs) => {
				let msgData = [];
				docs.forEach((doc) => msgData.push(doc.data()));
				setMsgCollection(msgData);
			});

			console.log(msgCollection);
		}
	};

	// --> handleSendMsg
	const handleSendMsg = async (e) => {
		e.preventDefault();
		const combinedId =
			user.uid > chat.uid ? user.uid + chat.uid : chat.uid + user.uid;

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
									<div className="chat_name">
										<h3>{chat.name}</h3>
									</div>
									<div className="messages_container">
										{msgCollection.length > 0 ? (
											msgCollection.map((msgItem, index) => (
												<Message user={user} msg={msgItem} key={index} />
											))
										) : (
											<p>No conversation with this individual</p>
										)}
									</div>
									<div className="message_form_container">
										<MessageForm
											msgText={msgText}
											setMsgText={setMsgText}
											handleSendMsg={handleSendMsg}
											setPayload={setPayload}
										/>
									</div>
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
