export interface SiteConfig {
  id: string;
  name: string;
  matches: string[]; // URL patterns to match
  defaultSettings: {
    blockFeed: boolean;
    [key: string]: boolean;
  };
  cssSelectors: {
    feed: string[];
    [key: string]: string[];
  };
}
