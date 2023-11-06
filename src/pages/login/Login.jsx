import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";

function Login() {
  const [err, setErr] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      setErr(true);
    }
  };

  return (
    <div className="login">
      <h2 className="heading">WhatsApp demo</h2>
      <div className="container">
        <h3>Login page</h3>
        <form onSubmit={handleSubmit} className="loginForm">
          <input type="email" placeholder="email"></input>
          <input type="password" placeholder="password"></input>
          <button>Sign in</button>
          {err && <span className="errMsg">Something went wrong...</span>}
        </form>
        <p>You don't have an account?</p>{" "}
        <Link to="/register">
          {" "}
          <p className="registerLink">Register</p>
        </Link>
      </div>
    </div>
  );
}

export default Login;
