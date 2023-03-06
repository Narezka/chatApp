import React, { useContext, useState } from "react";
import "./chat.css";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Messages from "../messages/Messages";
import Input from "../input/Input";
import { ChatContext } from "../../context/ChatContext";
import StarIcon from "@mui/icons-material/Star";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";

const Chat = () => {
  const [open, setOpen] = useState(false);
  const { data } = useContext(ChatContext);

  const deleteFriend = () => {
    console.log("deleted");
  };
  return (
    <div className="right">
      <div className="topMenuRight">
        <p className="contactNameRight">{data.user?.displayName}</p>
        <VideoCallIcon className="rightMenuIcons" />
        <PersonAddAlt1Icon className="rightMenuIcons" />
        <MoreHorizIcon
          onClick={() => {
            setOpen((prevValue) => !prevValue);
          }}
          className="rightMenuIcons"
        />
        {open && (
          <div className="dropdown">
            <span className="deleteFriend" onClick={() => deleteFriend()}>
              defriend <PersonRemoveIcon className="remove" />{" "}
            </span>
            <span className="favorite">
              {" "}
              favorite <StarIcon className="star" />
            </span>
          </div>
        )}
      </div>
      <Messages />

      <Input />
    </div>
  );
};

export default Chat;
