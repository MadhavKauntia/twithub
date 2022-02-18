import React, { useState } from "react";
import firebase from "../config/firebase-config";
import { getAuth, signOut } from "firebase/auth";

const auth = getAuth();

const AuthContext = React.createContext({
  token: "",
  secret: "",
  isLoggedIn: false,
  initials: "",
  twitterUsername: "",
  login: (token, secret, name, username) => {},
  logout: () => {},
});

export const AuthContextProvider = (props) => {
  const [token, setToken] = useState(null);
  const [secret, setSecret] = useState(null);
  const [initials, setInitials] = useState(null);
  const [twitterUsername, setTwitterUsername] = useState(null);

  const userIsLoggedIn = !!token && !!secret;

  const loginHandler = (token, secret, name, username) => {
    setToken(token);
    setSecret(secret);
    let rgx = new RegExp(/(\p{L}{1})\p{L}+/, "gu");

    let initial = [...name.matchAll(rgx)] || [];

    initial = (
      (initial.shift()?.[1] || "") + (initial.pop()?.[1] || "")
    ).toUpperCase();

    setInitials(initial);
    setTwitterUsername(username);
  };

  const logoutHandler = () => {
    setToken(null);
    setSecret(null);
    setInitials(null);
    setTwitterUsername(null);
    signOut(auth)
      .then(() => {})
      .catch((error) => {});
  };

  const contextValue = {
    token: token,
    secret: secret,
    initials: initials,
    isLoggedIn: userIsLoggedIn,
    twitterUsername: twitterUsername,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
