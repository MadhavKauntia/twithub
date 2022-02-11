import React, { useContext, useRef, useState } from "react";
import AuthContext from "../../store/auth-context";
import "./BannerPage.css";
import gitHubBanner from "../../assets/banner.png";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Banner from "../../components/Banner/Banner";
import LoadingBar from "react-top-loading-bar";

const BannerPage = () => {
  const githubUsernameRef = useRef();
  const authCtx = useContext(AuthContext);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const changeGitHubBannerHandler = async () => {
    setProgress(30);
    if (!githubUsernameRef.current || !githubUsernameRef.current.value) {
      setError("Username cannot be empty");
      setProgress(100);
      return;
    }
    setProgress(60);

    try {
      const res = await fetch(
        `http://localhost:3001/generateBanner?username=${githubUsernameRef.current.value}&token=${authCtx.token}&secret=${authCtx.secret}`
      );
      if (!res.ok) {
        const resData = await res.json();
        if (resData.error === "Request failed with status code 404") {
          setError("This GitHub user does not exist");
        } else {
          setError("An unexpected error occurred, please try again later.");
        }
      } else {
        setSuccess("Banner updated successfully");
      }
    } catch (err) {
      setError("An unexpected error occurred, please try again later.");
    }
    setProgress(100);
  };
  return (
    <div className="twithub__banner-page">
      <LoadingBar
        progress={progress}
        color="#1D9BF0"
        onLoaderFinished={() => setProgress(0)}
      />
      <Header />
      <div className="twithub__banner-page_content">
        <h2>Select a Banner</h2>
        <div className="scale-up-center">
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
            error={error}
            setError={setError}
            success={success}
            setSuccess={setSuccess}
            submitHandler={changeGitHubBannerHandler}
          />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default BannerPage;
