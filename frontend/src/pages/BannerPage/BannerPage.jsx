import React, { useContext, useRef } from "react";
import AuthContext from "../../store/auth-context";
import "./BannerPage.css";
import banner from "../../assets/banner.png";

const BannerPage = () => {
  const githubUsernameRef = useRef();
  const authCtx = useContext(AuthContext);

  const changeBannerHandler = () => {
    fetch(
      `http://localhost:3001/generateBanner?username=${githubUsernameRef.current.value}&token=${authCtx.token}&secret=${authCtx.secret}`
    );
  };
  return (
    <div className="twithub__banner-page">
      <button
        className="twithub__banner-page_logout-button"
        type="button"
        onClick={authCtx.logout}
      >
        Logout
      </button>
      <div className="twithub__banner-page_banners">
        <img src={banner} alt={banner} />
        <div className="twithub__banner-page_github">
          <label htmlFor="github-username">GitHub Username</label>
          <input id="github-username" ref={githubUsernameRef} />
        </div>
        <button type="button" onClick={changeBannerHandler}>
          Change Banner
        </button>
      </div>
    </div>
  );
};

export default BannerPage;
