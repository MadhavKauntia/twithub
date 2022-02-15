import axios from "axios";
import puppeteer from "puppeteer";
import { HTML_START, HTML_END } from "./html-snippets.js";
import updateBanner from "./update_banner.js";
import fs from "fs";

async function generateGitHubContributionsBanner(username, token, secret) {
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

  updateBanner(
    token,
    secret,
    {
      banner: base64Banner,
    },
    "generateGitHubContributionsBanner.png"
  );
}

async function generateGitHubContributionsBannerWithTitleAndDescription(
  username,
  token,
  secret,
  title,
  description
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
      h2.style.lineHeight = "30px";
      h2.style.fontFamily = "Brush Script MT";
      h2.innerText = title;
      h2.style.textAlign = "center";
      h2.innerHTML += `<br /><span style="font-size: 18px; text-align: center; font-weight: normal">${description}</p>`;
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

  updateBanner(
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
}

export {
  generateGitHubContributionsBanner,
  generateGitHubContributionsBannerWithTitleAndDescription,
};
