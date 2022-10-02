import React from "react";
import Img from "../testimonial3.png";

const OtherUser = ({ otherUser, selectUser }) => {
	const { avatar, isOnline, name } = otherUser;

	return (
		<div className="otherUser_container" onClick={() => selectUser(otherUser)}>
			<div className="img_container">
				<img src={avatar || Img} alt="user avatar" />
				<span
					className={`online_status ${isOnline ? "online" : "offline"}`}
				></span>
			</div>

			<div className="display_name">{name}</div>
		</div>
	);
};

export default OtherUser;
