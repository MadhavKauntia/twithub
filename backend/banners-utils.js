import axios from "axios";
import puppeteer from "puppeteer";
import { HTML_START, HTML_END } from "./html-snippets.js";
import updateBanner from "./update_banner.js";
import fs from "fs";
import DailyBanner from "./models/dailyBannersModel.js";

async function generateGitHubContributionsBanner(
  username,
  token,
  secret,
  twitterUsername,
  job = false
) {
  try {
    await axios.get(`https://api.github.com/users/${username}`);
  } catch (err) {
    throw err;
  }

  const res = await axios.get(
    "https://api.bloggify.net/gh-calendar/?username=" + username
  );

  const browser = await puppeteer.launch({
    ignoreDefaultArgs: ["--disable-extensions"],
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.setContent(HTML_START + res.data + HTML_END);
  await page.evaluate((selector) => {
    const element = document.querySelector(".js-calendar-graph-svg");
    element.style.paddingTop = "100px";
    element.style.paddingBottom = "100px";
    element.style.paddingLeft = "10px";
  });
  const content = await page.$(".js-calendar-graph-svg");
  await content.screenshot({ path: "generateGitHubContributionsBanner.png" });

  await browser.close();

  const base64Banner = fs.readFileSync(
    "generateGitHubContributionsBanner.png",
    {
      encoding: "base64",
    }
  );

  await updateBanner(
    token,
    secret,
    {
      banner: base64Banner,
    },
    "generateGitHubContributionsBanner.png"
  );
  if (!job) {
    try {
      await DailyBanner.updateOne(
        { twitterUsername },
        {
          githubUsername: username,
          twitterUsername,
          banner: "GITHUB_CONTRIBUTIONS_BANNER",
          token,
          secret,
          title: null,
          description: null,
        },
        { upsert: true }
      );
    } catch (err) {
      console.log(
        `Error while writing to DB for user: ${twitterUsername}: ${err.message}`
      );
    }
  }
}

async function generateGitHubContributionsBannerWithTitleAndDescription(
  username,
  token,
  secret,
  title,
  description,
  twitterUsername,
  job = false
) {
  try {
    await axios.get(`https://api.github.com/users/${username}`);
  } catch (err) {
    throw err;
  }

  const res = await axios.get(
    "https://api.bloggify.net/gh-calendar/?username=" + username
  );

  const browser = await puppeteer.launch({
    ignoreDefaultArgs: ["--disable-extensions"],
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.setContent(HTML_START + res.data + HTML_END);
  await page.evaluate(
    (title, description) => {
      const element = document.querySelector(".js-calendar-graph-svg");
      element.style.marginTop = "0";
      element.style.paddingBottom = "100px";
      element.style.paddingLeft = "10px";

      const h2 = document.querySelector("h2");
      h2.style.paddingTop = "20px";
      h2.style.fontWeight = "bold";
      h2.style.color = "#9EAFBA";
      h2.style.lineHeight = "25px";
      h2.style.fontFamily = "Brush Script MT";
      h2.innerText = title;
      h2.style.textAlign = "center";
      h2.innerHTML += `<br /><span style="font-size: 16px; text-align: center; font-weight: normal">${description}</p>`;
    },
    title,
    description
  );
  const content = await page.$("body");
  await content.screenshot({
    path: "generateGitHubContributionsBannerWithTitleAndDescription.png",
  });

  await browser.close();

  const base64Banner = fs.readFileSync(
    "generateGitHubContributionsBannerWithTitleAndDescription.png",
    {
      encoding: "base64",
    }
  );

  await updateBanner(
    token,
    secret,
    {
      banner: base64Banner,
      width: "2000",
      height: "280",
      offset_top: "0",
      offset_left: "0",
    },
    "generateGitHubContributionsBannerWithTitleAndDescription.png"
  );

  if (!job) {
    try {
      await DailyBanner.updateOne(
        { twitterUsername },
        {
          githubUsername: username,
          twitterUsername,
          banner: "GITHUB_CONTRIBUTIONS_TITLE_BANNER",
          token,
          secret,
          title,
          description,
        },
        { upsert: true }
      );
    } catch (err) {
      console.log(
        `Error while writing to DB for user: ${twitterUsername}: ${err.message}`
      );
    }
  }
}

async function stopBannerJob(twitterUsername) {
  try {
    await DailyBanner.findOneAndDelete({ twitterUsername });
  } catch (err) {
    console.log(
      `Error while deleting DB entry for user: ${twitterUsername}: ${err.message}`
    );
    throw err;
  }
}

async function getBannerStatus(twitterUsername) {
  try {
    const banner = await DailyBanner.findOne({ twitterUsername });
    return banner !== null;
  } catch (err) {
    console.log(
      `Error while fetching DB entry for user: ${twitterUsername}: ${err.message}`
    );
    throw err;
  }
}

export {
  generateGitHubContributionsBanner,
  generateGitHubContributionsBannerWithTitleAndDescription,
  stopBannerJob,
  getBannerStatus,
};
