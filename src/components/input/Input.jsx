import React, { useContext, useEffect, useState } from "react";
import "./input.css";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [file, setFile] = useState(null);
  const [perc, setPerc] = useState(null);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  useEffect(() => {
    const imgUpload = () => {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, img);

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
    img && imgUpload();
  }, [img]);

  const handleKey = (e) => {
    e.code === "Enter" && handleSend();
  };

  const handleSend = async () => {
    if (img) {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
          img: file,
        }),
      });
    } else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    setText("");
    setImg(null);
  };

  return (
    <div className="bottomRight">
      <input
        onKeyDown={handleKey}
        className="msgInput"
        type="text"
        placeholder="Type something....."
        onChange={(e) => setText(e.target.value)}
        value={text}
      ></input>
      {perc !== null && perc < 100 ? (
        <p className="perc">{Math.floor(perc)}%</p>
      ) : null}
      {perc === 100 && img && (
        <img className="attachment" alt="" src={URL.createObjectURL(img)} />
      )}
      <div className="sendContainer">
        <input
          onKeyDown={handleKey}
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={(e) => setImg(e.target.files[0])}
        />
        <AttachFileIcon className="msgIcons" />{" "}
        <label htmlFor="file">
          <AddPhotoAlternateIcon className="msgIcons" />
        </label>
      </div>
      <button
        disabled={perc !== null && perc < 100}
        className="send"
        onClick={handleSend}
      >
        send
      </button>{" "}
    </div>
  );
};

export default Input;
