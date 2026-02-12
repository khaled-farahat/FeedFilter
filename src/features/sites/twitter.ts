import { SiteConfig } from "./types";

export const twitter: SiteConfig = {
  id: "twitter",
  name: "X (Twitter)",
  matches: ["twitter.com", "x.com", "mobile.twitter.com"],
  defaultSettings: {
    blockFeed: false,
  },
  cssSelectors: {
    feed: [
      '[data-testid="primaryColumn"] section > div[aria-label*="Timeline"]',
      '[data-testid="primaryColumn"] > div > div > div > div > div > div > div[aria-label*="Timeline"]',
    ],
  },
};
