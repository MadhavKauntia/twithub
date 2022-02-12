import React, { useContext, useState } from "react";
import "./LoginPage.css";
import firebase from "../../config/firebase-config";
import { getAuth, signInWithPopup, TwitterAuthProvider } from "firebase/auth";
import twitterButton from "../../assets/sign-in-with-twitter.png";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../store/auth-context";
import Footer from "../../components/Footer/Footer";

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

        authCtx.login(
          credential.accessToken,
          credential.secret,
          result.user.displayName
        );
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
      <div className="twithub__login-page_content scale-up-center">
        <h1>TwitHub</h1>
        <p>
          Stand out by generating realtime banners designed for <br />
          Tech Twitter
        </p>
        <img src={twitterButton} alt="login" onClick={loginHandler} />
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;
