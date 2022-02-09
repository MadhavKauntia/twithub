import React, { useContext } from "react";
import "./LoginPage.css";
import firebase from "../../config/firebase-config";
import { getAuth, signInWithPopup, TwitterAuthProvider } from "firebase/auth";
import twitterButton from "../../assets/sign-in-with-twitter.png";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../store/auth-context";

const provider = new TwitterAuthProvider();

const auth = getAuth();

const LoginPage = () => {
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);

  const loginHandler = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
        // You can use these server side with your app's credentials to access the Twitter API.
        const credential = TwitterAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const secret = credential.secret;

        // The signed-in user info.
        const user = result.user;
        console.log(user);

        authCtx.login(token, secret);
        navigate("/banners", { replace: true });
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = TwitterAuthProvider.credentialFromError(error);
        // ...
      });
  };

  return (
    <div className="twithub__login-page">
      <h1>TwitHub</h1>
      <p>Twitter Banners for Tech Twitter</p>
      <img src={twitterButton} alt="login" onClick={loginHandler} />
    </div>
  );
};

export default LoginPage;
