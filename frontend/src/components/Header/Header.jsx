import React, { useContext } from "react";
import AuthContext from "../../store/auth-context";
import "./Header.css";

const Header = (props) => {
  const authCtx = useContext(AuthContext);
  return (
    <div className="twithub__header">
      <h1>
        <span style={{ color: "#1D9BF0" }}>Twit</span>
        <span style={{ color: "#9EAFBA" }}>Hub</span>
      </h1>
      <div className="twithub__header-profile" onClick={authCtx.logout}>
        <p>{props.initials}</p>
      </div>
    </div>
  );
};

export default Header;
