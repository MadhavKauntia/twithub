import express from "express";

import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

import { connectDB } from "./config/db.js";
connectDB();

import {
  generateGitHubContributionsBanner,
  generateGitHubContributionsBannerWithTitleAndDescription,
  stopBannerJob,
  getBannerStatus,
} from "./banners-utils.js";

import { daillyBannerTask } from "./schedulers/cronJobs.js";
daillyBannerTask.start();

import cors from "cors";
import rateLimit from "express-rate-limit";

const apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100,
});

var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.get(
  "/githubContributionsBanner",
  apiLimiter,
  cors(corsOptions),
  (req, res) => {
    if (
      !req.query.username ||
      !req.query.token ||
      !req.query.secret ||
      !req.query.twitter_username
    ) {
      res.status(400).send({ error: "Query params not present" });
      return;
    }
    generateGitHubContributionsBanner(
      req.query.username,
      req.query.token,
      req.query.secret,
      req.query.twitter_username.toLowerCase()
    )
      .then(() => {
        res.status(200).send();
      })
      .catch((err) => {
        res.status(500);
        res.send({ error: err.message });
      });
  }
);

app.get(
  "/githubContributionsBannerWithTitleAndDescription",
  apiLimiter,
  cors(corsOptions),
  (req, res) => {
    if (
      !req.query.username ||
      !req.query.token ||
      !req.query.secret ||
      !req.query.title ||
      !req.query.description ||
      !req.query.twitter_username
    ) {
      res.status(400).send({ error: "Query params not present" });
      return;
    }
    generateGitHubContributionsBannerWithTitleAndDescription(
      req.query.username,
      req.query.token,
      req.query.secret,
      req.query.title,
      req.query.description,
      req.query.twitter_username.toLowerCase()
    )
      .then(() => {
        res.status(200).send();
      })
      .catch((err) => {
        res.status(500);
        res.send({ error: err.message });
      });
  }
);

app.get("/bannerStatus", apiLimiter, cors(corsOptions), (req, res) => {
  if (!req.query.twitter_username) {
    res.status(400).send({
      error: "Username query param must be present",
    });
    return;
  }

  getBannerStatus(req.query.twitter_username.toLowerCase())
    .then((isBannerSet) => {
      res.status(200).send({ isBannerSet });
    })
    .catch((err) => {
      res.status(500);
      res.send({ error: err.message });
    });
});

app.options("/banner", cors(corsOptions));
app.delete("/banner", apiLimiter, cors(corsOptions), (req, res) => {
  if (!req.query.twitter_username || !req.query.token || !req.query.secret) {
    res.status(400).send({
      error: "Username, token and secret must be present",
    });
    return;
  }
  stopBannerJob(
    req.query.twitter_username.toLowerCase(),
    req.query.token,
    req.query.secret
  )
    .then(() => {
      console.log(`Deleted job for ${req.query.twitter_username}`);
      res.status(200).send();
    })
    .catch((err) => {
      res.status(500).send({
        error: err.message,
      });
    });
});

app.get("/", apiLimiter, cors(corsOptions), (req, res) => {
  res.status(200).send("UP");
});

app.listen(port, () => {
  console.log(port);
});
