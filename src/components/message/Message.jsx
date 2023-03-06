import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import "./message.css";

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  let msgTime = new Date(message.date.seconds * 1000);
  let hours = msgTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      ref={ref}
      className={`message ${message.senderId === currentUser.uid && "owner"}`}
    >
      <div className="userPic">
        <img
          className="friendIcon"
          src={
            message.senderId === currentUser.uid
              ? currentUser.photoURL
              : data.user.photoURL
          }
        />
        <p className="time">{hours}</p>
      </div>

      <div
        className={`msgContent ${
          message.senderId === currentUser.uid && "ownerContent"
        }`}
      >
        {message.text && (
          <p
            className={`msgText ${
              message.senderId === currentUser.uid && "ownerMsg"
            }`}
          >
            {message.text}
          </p>
        )}
        {message.img && <img className="msgPhoto" src={message.img} />}
      </div>
    </div>
  );
};

export default Message;
