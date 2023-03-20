import { signOut } from "firebase/auth";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { auth, db } from "../../firebase";
import Update from "../update/Update";
import "./navbar.css";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { doc, onSnapshot } from "firebase/firestore";

const Navbar = () => {
  const { currentUser } = useContext(AuthContext);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [data, setData] = useState({});

  const openForm = () => {
    setOpenMenu(false);
    setOpenUpdate(true);
  };

  useEffect(() => {
    const showUpdatedImg = () => {
      const unsub = onSnapshot(doc(db, "users", currentUser.uid), (doc) => {
        setData(doc.data());
      });
      return () => {
        unsub();
      };
    };
    currentUser.photoURL && showUpdatedImg();
  }, [currentUser.photoURL]);

  return (
    <>
      <div className="topMenuLeft">
        <p className="appName">WhatsApp demo</p>

        <div className="userInfo">
          <img alt="userImg" className="userImg" src={data.photoURL} />
          <p className="username">{data.displayName}</p>
        </div>

        <MoreVertIcon
          onClick={() => setOpenMenu((prev) => !prev)}
          className="menuIcon"
        />
        {openMenu && (
          <div className="buttons">
            <button onClick={() => signOut(auth)} className="logout">
              logout
            </button>
            <button className="updateButton" onClick={openForm}>
              update info
            </button>
          </div>
        )}
        {openUpdate && <Update setOpenUpdate={setOpenUpdate} />}
      </div>
    </>
  );
};

export default Navbar;
