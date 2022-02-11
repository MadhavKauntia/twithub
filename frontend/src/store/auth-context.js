import React, { useState } from "react";
import firebase from "../config/firebase-config";
import { getAuth, signOut } from "firebase/auth";

const auth = getAuth();

const AuthContext = React.createContext({
  token: "",
  secret: "",
  isLoggedIn: false,
  initials: "",
  login: (token, secret, name) => {},
  logout: () => {},
});

export const AuthContextProvider = (props) => {
  const [token, setToken] = useState(null);
  const [secret, setSecret] = useState(null);
  const [initials, setInitials] = useState(null);

  const userIsLoggedIn = !!token && !!secret;

  const loginHandler = (token, secret, name) => {
    setToken(token);
    setSecret(secret);
    let rgx = new RegExp(/(\p{L}{1})\p{L}+/, "gu");

    let initial = [...name.matchAll(rgx)] || [];

    initial = (
      (initial.shift()?.[1] || "") + (initial.pop()?.[1] || "")
    ).toUpperCase();

    setInitials(initial);
  };

  const logoutHandler = () => {
    setToken(null);
    setSecret(null);
    setInitials(null);
    signOut(auth)
      .then(() => {})
      .catch((error) => {});
  };

  const contextValue = {
    token: token,
    secret: secret,
    initials: initials,
    isLoggedIn: userIsLoggedIn,
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
