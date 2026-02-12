import { SiteConfig } from "./types";

export const youtube: SiteConfig = {
  id: "youtube",
  name: "YouTube",
  matches: ["youtube.com", "www.youtube.com", "m.youtube.com"],
  defaultSettings: {
    blockFeed: false,
  },
  cssSelectors: {
    feed: [
      "#primary",
      'ytd-browse[page-subtype="home"]',
      "ytd-rich-grid-renderer",
    ],
  },
};
