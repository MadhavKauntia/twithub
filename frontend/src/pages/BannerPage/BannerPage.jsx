import React, { useContext, useEffect, useRef, useState } from "react";
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
  const [bannerStatus, setBannerStatus] = useState(false);

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
        `${process.env.REACT_APP_BACKEND_URL}/githubContributionsBanner?username=${githubUsernameRef.current.value}&token=${authCtx.token}&secret=${authCtx.secret}&twitter_username=${authCtx.twitterUsername}`
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
        setBannerStatus(true);
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
        `${process.env.REACT_APP_BACKEND_URL}/githubContributionsBannerWithTitleAndDescription?username=${githubUsernameWithTitleRef.current.value}&token=${authCtx.token}&secret=${authCtx.secret}&title=${titleRef.current.value}&description=${descriptionRef.current.value}&twitter_username=${authCtx.twitterUsername}`
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
        setBannerStatus(true);
        setGithubContributionsWithTitleSuccess("Banner updated successfully");
      }
    } catch (err) {
      setGithubContributionsWithTitleError(
        "An unexpected error occurred, please try again later."
      );
    }
    setProgress(100);
  };

  useEffect(() => {
    const fetchBannerStatus = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/bannerStatus?twitter_username=${authCtx.twitterUsername}`
      );
      const responseData = await response.json();
      return responseData.isBannerSet ? responseData.isBannerSet : false;
    };
    fetchBannerStatus().then((isBannerSet) => {
      setBannerStatus(isBannerSet);
    });
  }, []);

  const stopBannerHandler = async () => {
    setProgress(75);
    fetch(
      `${process.env.REACT_APP_BACKEND_URL}/banner?twitter_username=${authCtx.twitterUsername}&token=${authCtx.token}&secret=${authCtx.secret}`,
      {
        method: "DELETE",
      }
    )
      .then((res) => {
        if (res.ok) {
          setBannerStatus(false);
        } else {
          alert(
            "An unexpected error occurred while deactivating your banner. Not to worry, please drop a mail to mkauntia@gmail.com with your issue. Will get it fixed ASAP."
          );
        }
      })
      .catch((err) => {
        console.log(
          `Error occurred while deleting job for ${authCtx.twitterUsername}: ${err.message}`
        );
        alert(
          "An unexpected error occurred while deactivating your banner. Not to worry, please drop a mail to mkauntia@gmail.com with your issue. Will get it fixed ASAP."
        );
      });
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
        <div className="twithub__banner-page_content-header">
          <h2>Select a Banner</h2>
          {bannerStatus && (
            <button type="button" onClick={stopBannerHandler}>
              Deactivate Banner
            </button>
          )}
        </div>
        <div className="scale-up-center">
          <Banner
            bannerImg={gitHubBanner}
            bannerImgAlt="GitHub Contributions Calendar"
            description={
              <React.Fragment>
                <p>
                  Use this template to set your{" "}
                  <span style={{ fontWeight: "bold" }}>
                    GitHub Contributions Calendar
                  </span>{" "}
                  as your Twitter Banner
                </p>
                <p style={{ marginTop: "0.5rem" }}>
                  This banner will automatically update every midnight.
                </p>
              </React.Fragment>
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
              <React.Fragment>
                <p>
                  Use this template to set your{" "}
                  <span style={{ fontWeight: "bold" }}>
                    GitHub Contributions Calendar
                  </span>{" "}
                  as your Twitter Banner along with an introduction
                </p>
                <p style={{ marginTop: "0.5rem" }}>
                  This banner will automatically update every midnight.
                </p>
              </React.Fragment>
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
