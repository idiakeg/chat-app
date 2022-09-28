import React, { useState, useEffect, useContext } from "react";
import image from "../testimonial3.png";
import { AiFillCamera } from "react-icons/ai";
import { storage, db, auth } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import authContext from "../contexts/authContext";

const Profile = () => {
	const [currUser, setCurrUser] = useState();
	const [img, setImg] = useState(null);
	const handleFileClick = (e) => {
		let newImg = e.target.files[0];
		setImg(newImg);
	};

	const { user } = useContext(authContext);

	useEffect(() => {
		if (user) {
			getDoc(doc(db, "users", auth.currentUser.uid)).then((docSnap) => {
				if (docSnap.exists()) {
					setCurrUser(docSnap.data());
				}
			});
		}

		if (img) {
			const uploadImage = async () => {
				const imageRef = ref(
					storage,
					`avatar/${new Date().getTime()} - ${img.name}`
				);
				const snap = await uploadBytes(imageRef, img);

				const imageUrl = await getDownloadURL(ref(storage, snap.ref.fullPath));

				await updateDoc(doc(db, "users", auth.currentUser.uid), {
					avatar: imageUrl,
					avatarPath: snap.ref.fullPath,
				});
			};

			uploadImage();
			setImg(null);
		}
	}, [img, user]);

	return (
		<div className="profile__container">
			{currUser ? (
				<section>
					<div className="avatar">
						<div className="image__container">
							<img src={currUser.avatar || image} alt="avatar" />
							<div className="overlay">
								<label htmlFor="photo">
									<AiFillCamera />
								</label>
								<input
									type="file"
									accept="image/*"
									id="photo"
									className="overlay_input"
									onChange={handleFileClick}
								/>
							</div>
						</div>
					</div>
					<div className="text__container">
						<h3>{currUser.name}</h3>
						<p>{currUser.email}</p>
						<hr />
						<p>Joined on: {currUser.createdAt.toDate().toDateString()}</p>
					</div>
				</section>
			) : (
				<p>Loading . . .</p>
			)}
		</div>
	);
};

export default Profile;
