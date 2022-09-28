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

	// This useEffect will run upon inital render of this component and again whenever "img" changes.
	useEffect(() => {
		// what we are doing is getting the currentuser fromour firestore, store it in the "currUser" varaible and populate the username and email fields in the profile with it. we are doing this insteady of using the user from the context Api because this provides us with the data as we created it(i.e name, email, online, uid)

		// the conditional helps us check to make sure that the user is logged in before getting the docs, this prevents errors that will break our app and so we donot show the profile when the user is not logged in.
		if (user) {
			getDoc(doc(db, "users", auth.currentUser.uid)).then((docSnap) => {
				if (docSnap.exists()) {
					setCurrUser(docSnap.data());
				}
			});
		}

		// if the "img" is not null, carry on the upload
		if (img) {
			const uploadImage = async () => {
				// create a reference for the image and placce to store, in this case, it will be the avatar folder and saved using the image's  name
				const imageRef = ref(
					storage,
					`avatar/${new Date().getTime()} - ${img.name}`
				);
				// uploading the image
				const snap = await uploadBytes(imageRef, img);
				// obtain the image url. This will be stored as part of the user's info on the database and this is the image that will be used as the user's avi. i.e it will be used as our value for src in the image container
				const imageUrl = await getDownloadURL(ref(storage, snap.ref.fullPath));
				// after the user uploads the image, we will update the user's data in the database to include an avatar and tha avatar path. The avatar path was included tmmo help with deletion of the image, if the need arises.
				await updateDoc(doc(db, "users", auth.currentUser.uid), {
					avatar: imageUrl,
					avatarPath: snap.ref.fullPath,
				});
			};

			// after the above process completes, call tghe function,
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
							<img src={image} alt="avatar" />
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
						<p>user email</p>
						<hr />
						<p>Joined on: ...</p>
					</div>
				</section>
			) : (
				<p>Loading . . .</p>
			)}
		</div>
	);
};

export default Profile;
