import { SiteConfig } from "./types";
import { youtube } from "./youtube";
import { twitter } from "./twitter";
import { facebook } from "./facebook";
import { instagram } from "./instagram";
import { linkedin } from "./linkedin";
import { reddit } from "./reddit";

export const sites: SiteConfig[] = [
  youtube,
  twitter,
  facebook,
  instagram,
  linkedin,
  reddit,
];

export const getSiteConfig = (hostname: string): SiteConfig | undefined => {
  return sites.find((site) =>
    site.matches.some((match) => hostname.includes(match)),
  );
};
