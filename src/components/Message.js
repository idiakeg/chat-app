import React from "react";
import Moment from "react-moment";

const Message = ({ msg, user }) => {
	return (
		<div className={`messages ${msg.from === user.uid ? "own" : "friend"} `}>
			<p>
				{msg.media && <img src={msg.media} alt={msg.text} />}
				{msg.text}
				<small>
					<Moment fromNow>{msg.createdAt.toDate()}</Moment>
				</small>
			</p>
		</div>
	);
};

export default Message;
