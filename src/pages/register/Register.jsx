import "./register.css";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../../firebase.js";
import { useEffect, useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [err, setErr] = useState(false);
  const [perc, setPerc] = useState(null);
  const [file, setFile] = useState("");
  const [data, setData] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const uploadFile = () => {
      const name = new Date().getTime() + file.name;

      const storageRef = ref(storage, file.name);

      const uploadTask = uploadBytesResumable(storageRef, file);

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
          setErr(true);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            setData((prev) => ({ ...prev, photoURL: downloadURL }));
          });
        }
      );
    };
    file && uploadFile();
  }, [file]);

  const handleInput = (e) => {
    const id = e.target.id;
    const value = e.target.value;

    setData({ ...data, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const password = e.target[2].value;

    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        data.email,
        password
      );
      await updateProfile(res.user, {
        displayName: data.displayName,
        photoURL: data.photoURL,
      });
      await setDoc(doc(db, "users", res.user.uid), {
        ...data,
        uid: res.user.uid,
      });

      await setDoc(doc(db, "userChats", res.user.uid), {});
      navigate("/");
    } catch (error) {
      setErr(true);
    }
  };
  return (
    <div className="register">
      <h1>WhatsApp demo</h1>
      <div className="container">
        <h3>Register page</h3>
        <form className="registerForm" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="display name"
            id="displayName"
            onChange={handleInput}
          />
          <input
            type="email"
            placeholder="email"
            id="email"
            onChange={handleInput}
          />
          <input type="password" placeholder="password" />

          <input
            style={{ display: "none" }}
            type="file"
            id="file"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <label htmlFor="file" className="upload">
            {perc === 100 ? (
              <p className="add">
                <img
                  alt="add"
                  className="addAvatar"
                  src="https://cdn-icons-png.flaticon.com/512/1176/1176381.png"
                />
                Want to change?
              </p>
            ) : (
              <p className="add">
                <img
                  alt="add"
                  className="addAvatar"
                  src="https://cdn-icons-png.flaticon.com/512/1176/1176381.png"
                />
                Choose avatar
              </p>
            )}
            {perc !== null && perc < 100 ? (
              <p className="percUpload">{Math.floor(perc)}%</p>
            ) : null}
            {perc === 100 && file && (
              <img className="ava" alt="" src={URL.createObjectURL(file)} />
            )}
          </label>

          <button disabled={perc !== null && perc < 100} type="submit">
            Sign up
          </button>

          {err && <span className="errMsg">Something went wrong...</span>}
        </form>
        <p className="account">You do have an account?</p>{" "}
        <Link to="/login">
          <p className="loginLink">Login</p>
        </Link>
      </div>
    </div>
  );
}

export default Register;
