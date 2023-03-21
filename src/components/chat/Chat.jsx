import React, { useContext, useState } from "react";
import "./chat.css";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Messages from "../messages/Messages";
import Input from "../input/Input";
import { ChatContext } from "../../context/ChatContext";

const Chat = () => {
  const { data } = useContext(ChatContext);

  return (
    <div className="right">
      <div className="topMenuRight">
        <p className="contactNameRight">{data.user?.displayName}</p>
        <VideoCallIcon className="rightMenuIcons" />
        <PersonAddAlt1Icon className="rightMenuIcons" />
        <MoreHorizIcon className="rightMenuIcons" />
      </div>
      <Messages />

      <Input />
    </div>
  );
};

export default Chat;
