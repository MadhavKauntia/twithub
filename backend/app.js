import client from "twitter-api-client";
import express from "express";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();
import axios from "axios";
const app = express();
const port = process.env.PORT || 3001;
import puppeteer from "puppeteer";
import { HTML_START, HTML_END } from "./html-snippets.js";
import cors from "cors";
import rateLimit from "express-rate-limit";

const apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100,
});

const FILE_NAME = "contributions.png";

var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

async function generateBanner(username) {
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
  await content.screenshot({ path: FILE_NAME });
  await browser.close();
}

async function updateBanner(token, secret) {
  try {
    const twitterClient = new client.TwitterClient({
      apiKey: process.env.TWITTER_API_KEY,
      apiSecret: process.env.TWITTER_API_SECRET,
      accessToken: token,
      accessTokenSecret: secret,
    });
    const base64Banner = fs.readFileSync(FILE_NAME, {
      encoding: "base64",
    });
    await twitterClient.accountsAndUsers.accountUpdateProfileBanner({
      banner: base64Banner,
    });
  } catch (err) {
    throw err;
  }
  fs.unlink(FILE_NAME, (err) => {
    if (err) throw err;
  });
}

app.get("/generateBanner", apiLimiter, cors(corsOptions), (req, res) => {
  if (!req.query.username || !req.query.token || !req.query.secret) {
    res.status(400).send({ error: "Query params not present" });
  }
  generateBanner(req.query.username)
    .then(() => {
      updateBanner(req.query.token, req.query.secret)
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

app.get("/", apiLimiter, cors(corsOptions), (req, res) => {
  res.status(200).send("UP");
});

app.listen(port, () => {
  console.log(port);
});
