import { SiteConfig } from "./types";

export const facebook: SiteConfig = {
  id: "facebook",
  name: "Facebook",
  matches: ["facebook.com", "www.facebook.com", "m.facebook.com"],
  defaultSettings: {
    blockFeed: false,
  },
  cssSelectors: {
    feed: [
      '[role="feed"]',
      "#ssrb_feed_start + div",
      ".x1hc1fzr.x1unhpq9.x6o7n8i",
    ],
  },
};
