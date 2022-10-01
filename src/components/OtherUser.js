import React from "react";
import Img from "../testimonial3.png";

const OtherUser = (props) => {
	const { name, avatar, isOnline } = props;
	console.log(name, avatar, isOnline);
	return (
		<div className="otherUser_container">
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
