import { sites, getSiteConfig } from "@/features/sites";
import { SiteConfig } from "@/features/sites/types";

export default defineContentScript({
  matches: [
    "*://*.youtube.com/*",
    "*://*.twitter.com/*",
    "*://*.x.com/*",
    "*://*.facebook.com/*",
    "*://*.instagram.com/*",
    "*://*.linkedin.com/*",
    "*://*.reddit.com/*",
  ],
  main() {
    const STYLE_ID = "feed-filter-style";

    // Re-define Settings interface based on new structure if needed,
    // or import from a shared types file if we had one.
    // For now, mirroring the logic.
    interface SiteSettings {
      blockFeed: boolean;
      [key: string]: boolean;
    }
    interface Settings {
      [siteId: string]: SiteSettings;
    }

    let currentSettings: Settings = {};
    let activeSite: SiteConfig | undefined;

    function getActiveSite(): SiteConfig | undefined {
      return getSiteConfig(window.location.hostname);
    }

    function shouldBlockFeature(feature: string): boolean {
      if (!activeSite) return false;
      const siteSettings = currentSettings[activeSite.id];
      // If no settings exist for this site, use default
      if (!siteSettings) return activeSite.defaultSettings[feature] || false;

      return siteSettings[feature] === true;
    }

    function applyBlocking() {
      activeSite = getActiveSite();
      if (!activeSite) return;

      const existingStyle = document.getElementById(STYLE_ID);

      const shouldBlockFeed = shouldBlockFeature("blockFeed");

      // Future: check other features like 'blockShorts'

      let cssRules: string[] = [];

      if (shouldBlockFeed) {
        if (activeSite.cssSelectors.feed) {
          cssRules.push(
            ...activeSite.cssSelectors.feed.map(
              (s) => `${s} { display: none !important; }`,
            ),
          );
        }
      }

      if (cssRules.length > 0) {
        const css = cssRules.join("\n");
        if (existingStyle) {
          existingStyle.textContent = css;
        } else {
          const style = document.createElement("style");
          style.id = STYLE_ID;
          style.textContent = css;
          document.head.appendChild(style);
        }
        console.log(`FeedFilter: Blocking enabled for ${activeSite.name}`);
      } else {
        if (existingStyle) {
          existingStyle.remove();
          console.log(`FeedFilter: Blocking disabled for ${activeSite.name}`);
        }
      }
    }

    // Initial load
    browser.storage.local.get("siteSettings").then((res) => {
      if (res.siteSettings) {
        currentSettings = res.siteSettings as Settings;
        applyBlocking();
      } else {
        // Legacy migration check could stay or be removed if assumed done
        browser.storage.local.get("blockedSites").then((oldRes) => {
          if (oldRes.blockedSites) {
            const oldBlocked = oldRes.blockedSites as Record<string, boolean>;
            const newSettings: Settings = {};
            sites.forEach((site) => {
              newSettings[site.id] = { blockFeed: !!oldBlocked[site.id] };
            });
            currentSettings = newSettings;
            applyBlocking();
          }
        });
      }
    });

    // Listen for changes
    browser.storage.onChanged.addListener((changes) => {
      if (changes.siteSettings) {
        currentSettings = changes.siteSettings.newValue as Settings;
        applyBlocking();
      }
    });

    // Watch for DOM changes
    const observer = new MutationObserver(() => {
      // Re-apply if style is missing but should be there
      // This check is slightly less efficient than before but more generic
      // We can optimize if needed by storing the expected state
      const styleExists = !!document.getElementById(STYLE_ID);
      // We re-calculate "should block" - mostly cheap
      activeSite = getActiveSite();
      if (activeSite) {
        const shouldBlock = shouldBlockFeature("blockFeed");
        if (shouldBlock && !styleExists) {
          applyBlocking();
        }
      }
    });

    observer.observe(document.head, { childList: true });
  },
});
