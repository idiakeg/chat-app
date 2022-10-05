import React from "react";
import { BsCardImage } from "react-icons/bs";

const MessageForm = ({ handleSendMsg, msgText, setMsgText, setPayload }) => {
	return (
		<form onSubmit={handleSendMsg} className="message_form">
			<label htmlFor="file_upload">
				<BsCardImage />
			</label>
			<input
				type="file"
				accept="image/*"
				id="file_upload"
				onChange={(e) => setPayload(e.target.files[0])}
			/>
			<input
				type="text"
				value={msgText}
				onChange={(e) => setMsgText(e.target.value)}
			/>
			<button type="submit">send</button>
		</form>
	);
};

export default MessageForm;
