import express from "express";

import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

import {
  generateGitHubContributionsBanner,
  generateGitHubContributionsBannerWithTitleAndDescription,
} from "./generate-banners.js";

import cors from "cors";
import rateLimit from "express-rate-limit";

const apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
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
    if (!req.query.username || !req.query.token || !req.query.secret) {
      res.status(400).send({ error: "Query params not present" });
    }
    generateGitHubContributionsBanner(
      req.query.username,
      req.query.token,
      req.query.secret
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
      !req.query.description
    ) {
      res.status(400).send({ error: "Query params not present" });
    }
    generateGitHubContributionsBannerWithTitleAndDescription(
      req.query.username,
      req.query.token,
      req.query.secret,
      req.query.title,
      req.query.description
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

app.get("/", apiLimiter, cors(corsOptions), (req, res) => {
  res.status(200).send("UP");
});

app.listen(port, () => {
  console.log(port);
});
