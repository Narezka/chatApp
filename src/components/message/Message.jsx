import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { db } from "../../firebase";
import "./message.css";

const Message = ({ message }) => {
  const [newData, setNewData] = useState({});
  const [update, setUpdate] = useState({});
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

  useEffect(() => {
    const showUpdatedImg = () => {
      const unsub = onSnapshot(doc(db, "users", currentUser.uid), (doc) => {
        setNewData(doc.data());
      });
      return () => {
        unsub();
      };
    };
    currentUser.photoURL && showUpdatedImg();
  }, [currentUser.photoURL]);

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
              ? newData.photoURL
              : // : update.photoURL
                data.user.photoURL
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
