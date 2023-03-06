import "./home.css";
import Sidebar from "../../components/sidebar/Sidebar";
import React from "react";
import Chat from "../../components/chat/Chat";

function Home() {
  return (
    <div className="home">
      <Sidebar />
      <Chat />
    </div>
  );
}

export default Home;
