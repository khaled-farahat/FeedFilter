import { SiteConfig } from "./types";

export const reddit: SiteConfig = {
  id: "reddit",
  name: "Reddit",
  matches: ["reddit.com", "www.reddit.com", "old.reddit.com"],
  defaultSettings: {
    blockFeed: false,
  },
  cssSelectors: {
    feed: ["#main-content", "shreddit-feed", ".feed-container"],
  },
};
