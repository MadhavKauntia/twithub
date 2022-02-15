import React, { useContext, useRef, useState } from "react";
import AuthContext from "../../store/auth-context";
import "./BannerPage.css";
import gitHubBanner from "../../assets/banner.png";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Banner from "../../components/Banner/Banner";
import githubContributionsWithTitleBanner from "../../assets/githubContributionsWithTItle.png";
import LoadingBar from "react-top-loading-bar";

const BannerPage = () => {
  // Banner Refs
  const githubUsernameRef = useRef();
  const githubUsernameWithTitleRef = useRef();
  const titleRef = useRef();
  const descriptionRef = useRef();

  const authCtx = useContext(AuthContext);
  const [progress, setProgress] = useState(0);

  // Banner error and success states
  const [githubContributionsError, setGithubContributionsError] =
    useState(null);
  const [githubContributionsSuccess, setGithubContributionsSuccess] =
    useState(null);
  const [
    githubContributionsWithTitleError,
    setGithubContributionsWithTitleError,
  ] = useState(null);
  const [
    githubContributionsWithTitleSuccess,
    setGithubContributionsWithTitleSuccess,
  ] = useState(null);

  const changeGitHubBannerHandler = async () => {
    setGithubContributionsError(null);
    setGithubContributionsSuccess(null);
    setProgress(30);
    if (!githubUsernameRef.current || !githubUsernameRef.current.value) {
      setGithubContributionsError("Username cannot be empty");
      setProgress(100);
      return;
    }
    setProgress(60);

    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/githubContributionsBanner?username=${githubUsernameRef.current.value}&token=${authCtx.token}&secret=${authCtx.secret}`
      );

      if (!res.ok) {
        const resData = await res.json();
        if (resData.error === "Request failed with status code 404") {
          setGithubContributionsError("This GitHub user does not exist");
        } else {
          setGithubContributionsError(
            "An unexpected error occurred, please try again later."
          );
        }
      } else {
        setGithubContributionsSuccess("Banner updated successfully");
      }
    } catch (err) {
      setGithubContributionsError(
        "An unexpected error occurred, please try again later."
      );
    }
    setProgress(100);
  };

  const changeGitHubBannerWithTitleHandler = async () => {
    setGithubContributionsWithTitleError(null);
    setGithubContributionsWithTitleSuccess(null);
    setProgress(30);
    if (
      !githubUsernameWithTitleRef.current ||
      !githubUsernameWithTitleRef.current.value
    ) {
      setGithubContributionsWithTitleError("Username cannot be empty");
      setProgress(100);
      return;
    }
    if (!titleRef.current || !titleRef.current.value) {
      setGithubContributionsWithTitleError("Title cannot be empty");
      setProgress(100);
      return;
    }
    if (!descriptionRef.current || !descriptionRef.current.value) {
      setGithubContributionsWithTitleError("Description cannot be empty");
      setProgress(100);
      return;
    }
    setProgress(60);

    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/githubContributionsBannerWithTitleAndDescription?username=${githubUsernameWithTitleRef.current.value}&token=${authCtx.token}&secret=${authCtx.secret}&title=${titleRef.current.value}&description=${descriptionRef.current.value}`
      );

      if (!res.ok) {
        const resData = await res.json();
        if (resData.error === "Request failed with status code 404") {
          setGithubContributionsWithTitleError(
            "This GitHub user does not exist"
          );
        } else {
          setGithubContributionsWithTitleError(
            "An unexpected error occurred, please try again later."
          );
        }
      } else {
        setGithubContributionsWithTitleSuccess("Banner updated successfully");
      }
    } catch (err) {
      setGithubContributionsWithTitleError(
        "An unexpected error occurred, please try again later."
      );
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
            inputRefs={[githubUsernameRef]}
            inputLabels={["Your GitHub Username"]}
            error={githubContributionsError}
            setError={setGithubContributionsError}
            success={githubContributionsSuccess}
            setSuccess={setGithubContributionsSuccess}
            submitHandler={changeGitHubBannerHandler}
          />
          <Banner
            bannerImg={githubContributionsWithTitleBanner}
            bannerImgAlt="GitHub Contributions Calendar With Text"
            description={
              <p>
                Use this template to set your{" "}
                <span style={{ fontWeight: "bold" }}>
                  GitHub Contributions Calendar
                </span>{" "}
                as your Twitter Banner along with an introduction
              </p>
            }
            inputRefs={[githubUsernameWithTitleRef, titleRef, descriptionRef]}
            inputLabels={["Your GitHub Username", "Title", "Description"]}
            error={githubContributionsWithTitleError}
            setError={setGithubContributionsWithTitleError}
            success={githubContributionsWithTitleSuccess}
            setSuccess={setGithubContributionsWithTitleSuccess}
            submitHandler={changeGitHubBannerWithTitleHandler}
          />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default BannerPage;
