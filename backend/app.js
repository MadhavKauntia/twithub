import client from "twitter-api-client";
import express from "express";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();
import axios from "axios";
const app = express();
const port = process.env.PORT || 3000;
import puppeteer from "puppeteer";
import { HTML_START, HTML_END } from "./html-snippets.js";

const twitterClient = new client.TwitterClient({
  apiKey: process.env.TWITTER_API_KEY,
  apiSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

const FILE_NAME = "contributions.png";

async function generateBanner(username) {
  const res = await axios.get(
    "https://api.bloggify.net/gh-calendar/?username=" + username
  );

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(HTML_START + res.data + HTML_END);
  await page.evaluate((selector) => {
    const element = document.querySelector(".js-calendar-graph-svg");
    element.style.paddingTop = "100px";
    element.style.paddingBottom = "100px";
    element.style.paddingLeft = "10px";
  });
  const content = await page.$(".js-calendar-graph-svg");
  await content.screenshot({ path: FILE_NAME });
  await browser.close();
}

async function updateBanner() {
  try {
    const base64Banner = fs.readFileSync(FILE_NAME, {
      encoding: "base64",
    });
    await twitterClient.accountsAndUsers.accountUpdateProfileBanner({
      banner: base64Banner,
    });
  } catch (err) {
    console.log(err);
  }
  fs.unlink(FILE_NAME, (err) => {
    if (err) throw err;
  });
}

app.get("/generateBanner", (req, res) => {
  generateBanner(req.query.username)
    .then(() => {
      updateBanner()
        .then(() => {
          res.status(200);
          res.send();
        })
        .catch((err) => {
          res.status(500);
          res.send({ error: err.message });
        });
    })
    .catch((err) => {
      res.status(500);
      res.send({ error: err.message });
    });
});

app.listen(port, () => {
  console.log(port);
});
