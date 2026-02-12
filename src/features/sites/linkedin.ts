import { SiteConfig } from "./types";

export const linkedin: SiteConfig = {
  id: "linkedin",
  name: "LinkedIn",
  matches: ["linkedin.com", "www.linkedin.com"],
  defaultSettings: {
    blockFeed: false,
  },
  cssSelectors: {
    feed: [
      ".scaffold-layout__main",
      ".feed-shared-update-v2",
      "div.scaffold-finite-scroll",
    ],
  },
};
