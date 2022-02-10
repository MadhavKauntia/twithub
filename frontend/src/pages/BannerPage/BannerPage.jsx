import React, { useContext, useRef } from "react";
import AuthContext from "../../store/auth-context";
import "./BannerPage.css";
import gitHubBanner from "../../assets/banner.png";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Banner from "../../components/Banner/Banner";

const BannerPage = () => {
  const githubUsernameRef = useRef();
  const authCtx = useContext(AuthContext);

  const changeGitHubBannerHandler = async () => {
    if (!githubUsernameRef.current || !githubUsernameRef.current.value) {
      alert("Username cannot be empty");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:3001/generateBanner?username=${githubUsernameRef.current.value}&token=${authCtx.token}&secret=${authCtx.secret}`
      );
      const resData = await res.json();
      if (resData.error) {
        alert(`Error occured: ${resData.error}`);
      }
      githubUsernameRef.current.value = "";
    } catch (err) {
      alert(`Error occured: ${err.message}`);
    }
  };
  return (
    <div className="twithub__banner-page">
      <Header initials={authCtx.initials} />
      <div className="twithub__banner-page_content">
        <h2>Select a Banner</h2>
        <Banner
          bannerImg={gitHubBanner}
          bannerImgAlt="GitHub Contributions Calendar"
          description={
            <p>
              Use this template to set your{" "}
              <span style={{ fontWeight: "bold" }}>
                GitHub Contributions Calendar
              </span>{" "}
              as your Twitter Banner
            </p>
          }
          inputRef={githubUsernameRef}
          inputLabel="Your GitHub Username..."
          submitHandler={changeGitHubBannerHandler}
        />
        <Footer />
      </div>
    </div>
  );
};

export default BannerPage;
