import { SiteConfig } from "./types";

export const instagram: SiteConfig = {
  id: "instagram",
  name: "Instagram",
  matches: ["instagram.com", "www.instagram.com"],
  defaultSettings: {
    blockFeed: false,
  },
  cssSelectors: {
    feed: [
      "main[role='main'] article",
      "svg[aria-label='Loading...']",
      "div[role='progressbar']",
      "div[style*='background-color: rgb(239, 239, 239)']",
      "div._aayat",
    ],
  },
};
