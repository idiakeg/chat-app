import React from "react";
import image from "../testimonial3.png";
import { AiFillCamera } from "react-icons/ai";

const Profile = () => {
	return (
		<div className="profile__container">
			<section>
				<div className="avatar">
					<div className="image__container">
						<img src={image} alt="avatar" />
						<div className="overlay">
							<label htmlFor="photo">
								<AiFillCamera />
							</label>
							<input type="file" name="" id="photo" className="overlay_input" />
						</div>
					</div>
				</div>
				<div className="text__container">
					<h3>User Name</h3>
					<p>User email</p>
					<hr />
					<p>Joined on: ...</p>
				</div>
			</section>
		</div>
	);
};

export default Profile;
