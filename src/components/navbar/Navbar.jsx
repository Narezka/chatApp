import { signOut } from "firebase/auth";
import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { auth } from "../../firebase";
import "./navbar.css";

const Navbar = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <>
      <div className="topMenuLeft">
        <p className="appName">WhatsApp demo</p>

        <div className="userInfo">
          <img alt="userImg" className="userImg" src={currentUser.photoURL} />
          <p className="username">{currentUser.displayName}</p>
        </div>

        <button onClick={() => signOut(auth)} className="logout">
          logout
        </button>
      </div>
    </>
  );
};

export default Navbar;
