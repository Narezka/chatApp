import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { v4 as uuid } from "uuid";
import "./update.css";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "../../firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";

const Update = ({ setOpenUpdate }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const [newImg, setNewImg] = useState(null);
  const [perc, setPerc] = useState(null);
  const [newName, setNewName] = useState("");
  const [file, setFile] = useState(null);
  const [updates, setUpdates] = useState({});
  const imgInputRef = useRef();

  useEffect(() => {
    const imgUpload = () => {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, newImg);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          setPerc(progress);
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          console.log("error upload file", error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setFile(downloadURL);
          });
        }
      );
    };
    newImg && imgUpload();
  }, [newImg]);

  const updateAvatar = async (e) => {
    e.preventDefault();
    await updateDoc(doc(db, "users", currentUser.uid), {
      photoURL: file,
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".userInfo"]: {
        uid: currentUser.uid,
        displayName: updates.displayName,
        photoURL: file,
      },
    });

    imgInputRef.current.value = "";
    setNewImg(null);
  };

  useEffect(() => {
    const showUpdatedImg = () => {
      const unsub = onSnapshot(doc(db, "users", currentUser.uid), (doc) => {
        setUpdates(doc.data());
      });
      return () => {
        unsub();
      };
    };
    currentUser.photoURL && showUpdatedImg();
  }, [currentUser.photoURL]);

  const updateUsername = async (e) => {
    e.preventDefault();
    await updateDoc(doc(db, "users", currentUser.uid), {
      displayName: newName,
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".userInfo"]: {
        uid: currentUser.uid,
        displayName: newName,
        photoURL: updates.photoURL,
      },
    });
    setNewName("");
  };

  return (
    <div className="update">
      <span>Update form</span>
      <button className="updateClose" onClick={() => setOpenUpdate(false)}>
        X
      </button>
      <div className="bottomForm">
        <div className="currentInfo">
          <div className="cardHeading">
            <p className="heading">Current info</p>
          </div>
          <div className="infoCard">
            <img alt="userImg" className="userAva" src={updates.photoURL} />
            <div className="data">
              <div className="name">
                <p className="currentData">Username: </p>
                <p className="currentName">{updates.displayName}</p>
              </div>
              <div className="email">
                <p className="currentData">Email: </p>
                <p className="currentEmail">{currentUser.email}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="changeForm">
          <div className="imgUpdate">
            <div className="chooseImg">
              <p className="nameTags">Avatar</p>
              <input
                className="input"
                type="file"
                onChange={(e) => setNewImg(e.target.files[0])}
                ref={imgInputRef}
              />
              {perc !== null && perc < 100 ? (
                <p className="perc">{Math.floor(perc)}%</p>
              ) : null}
              {perc === 100 && newImg && (
                <div>
                  <img
                    className="newAva"
                    alt=""
                    src={URL.createObjectURL(newImg)}
                  />
                  {/* <DeleteIcon onClick={deleteImg} className="deleteIcon" /> */}
                </div>
              )}
            </div>

            <div className="submit">
              <button
                disabled={perc !== null && perc < 100}
                onClick={updateAvatar}
                className="sendUpdate"
              >
                update
              </button>
            </div>
          </div>

          <div className="nameUpdate">
            <div className="changeName">
              <p className="nameTags">Username</p>
              <input
                className="input"
                type="text"
                placeholder="new username"
                onChange={(e) => setNewName(e.target.value)}
                value={newName}
              />
            </div>
            <div className="submit">
              <button
                disabled={newName === ""}
                onClick={updateUsername}
                className="sendUpdate"
              >
                update
              </button>
            </div>
          </div>

          {/* <div className="emailUpdate">
            <p>Email</p>
            <input type="email" placeholder="new email" />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Update;
