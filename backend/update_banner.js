import client from "twitter-api-client";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

async function updateBanner(token, secret, updateOptions, fileName) {
  try {
    const twitterClient = new client.TwitterClient({
      apiKey: process.env.TWITTER_API_KEY,
      apiSecret: process.env.TWITTER_API_SECRET,
      accessToken: token,
      accessTokenSecret: secret,
    });
    await twitterClient.accountsAndUsers.accountUpdateProfileBanner(
      updateOptions
    );
  } catch (err) {
    console.log(err);
    throw err;
  }
  fs.unlink(fileName, (err) => {
    if (err) throw err;
  });
}

export default updateBanner;
