import cron from "node-cron";
import DailyBanner from "../models/dailyBannersModel.js";
import {
  generateGitHubContributionsBanner,
  generateGitHubContributionsBannerWithTitleAndDescription,
} from "../banners-utils.js";

const daillyBannerTask = cron.schedule("0 0 * * *", async () => {
  console.log("Starting daily job...");
  const dailyBanners = await DailyBanner.find();
  dailyBanners.forEach((banner) => {
    switch (banner.banner) {
      case "GITHUB_CONTRIBUTIONS_BANNER":
        generateGitHubContributionsBanner(
          banner.githubUsername,
          banner.token,
          banner.secret,
          banner.twitterUsername,
          true
        ).catch((err) => {
          console.log(
            `Error while updating banner for user ${banner.twitterUsername}: ${err.message}`
          );
        });
        break;
      case "GITHUB_CONTRIBUTIONS_TITLE_BANNER":
        generateGitHubContributionsBannerWithTitleAndDescription(
          banner.githubUsername,
          banner.token,
          banner.secret,
          banner.title,
          banner.description,
          banner.twitterUsername,
          true
        ).catch((err) => {
          console.log(
            `Error while updating banner for user ${banner.twitterUsername}: ${err.message}`
          );
        });
        break;
    }
  });
});

export { daillyBannerTask };
