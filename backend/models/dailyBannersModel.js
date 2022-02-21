import mongoose from "mongoose";

const dailyBannersModel = mongoose.Schema(
  {
    githubUsername: {
      type: String,
      required: true,
    },
    twitterUsername: {
      type: String,
      required: true,
    },
    banner: {
      type: String,
      required: true,
    },
    token: {
      type: mongoose.Schema({ iv: String, content: String }),
      required: true,
    },
    secret: {
      type: mongoose.Schema({ iv: String, content: String }),
      required: true,
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("DailyBanner", dailyBannersModel);
