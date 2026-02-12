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
    let currentBlockedSites: Record<string, boolean> = {};

    const SITE_SELECTORS: Record<string, string[]> = {
      youtube: [
        "#primary",
        'ytd-browse[page-subtype="home"]',
        "ytd-rich-grid-renderer",
      ],
      twitter: [
        '[data-testid="primaryColumn"] section > div[aria-label*="Timeline"]',
        '[data-testid="primaryColumn"] > div > div > div > div > div > div > div[aria-label*="Timeline"]', // Fallback
      ],
      x: [
        '[data-testid="primaryColumn"] section > div[aria-label*="Timeline"]',
      ],
      facebook: [
        '[role="feed"]',
        "#ssrb_feed_start + div",
        ".x1hc1fzr.x1unhpq9.x6o7n8i",
      ],
      instagram: [
        // Target individual posts to avoid breaking layout containers or loading states
        "main[role='main'] article",
        // Hide loading indicators/spinners to avoid "stuck" loading state
        "svg[aria-label='Loading...']",
        "div[role='progressbar']",
        // Hide skeleton loaders (often gray divs in feed)
        "div[style*='background-color: rgb(239, 239, 239)']", // Common skeleton color
        "div._aayat", // Skeleton class (might change)
      ],
      linkedin: [
        ".scaffold-layout__main",
        ".feed-shared-update-v2",
        "div.scaffold-finite-scroll",
      ],
      reddit: ["#main-content", "shreddit-feed", ".feed-container"],
    };

    function getSelectorsForCurrentSite(): string[] {
      const hostname = window.location.hostname;
      if (hostname.includes("youtube")) return SITE_SELECTORS.youtube;
      if (hostname.includes("twitter") || hostname.includes("x.com"))
        return [...SITE_SELECTORS.twitter, ...SITE_SELECTORS.x];
      if (hostname.includes("facebook")) return SITE_SELECTORS.facebook;
      if (hostname.includes("instagram")) return SITE_SELECTORS.instagram;
      if (hostname.includes("linkedin")) return SITE_SELECTORS.linkedin;
      if (hostname.includes("reddit")) return SITE_SELECTORS.reddit;
      return [];
    }

    function shouldBlockCurrentSite(): boolean {
      const hostname = window.location.hostname;
      if (hostname.includes("youtube") && currentBlockedSites.youtube)
        return true;
      if (
        (hostname.includes("twitter") || hostname.includes("x.com")) &&
        currentBlockedSites.twitter
      )
        return true;
      if (hostname.includes("facebook") && currentBlockedSites.facebook)
        return true;
      if (hostname.includes("instagram") && currentBlockedSites.instagram)
        return true;
      if (hostname.includes("linkedin") && currentBlockedSites.linkedin)
        return true;
      if (hostname.includes("reddit") && currentBlockedSites.reddit)
        return true;
      return false;
    }

    function applyBlocking() {
      const existingStyle = document.getElementById(STYLE_ID);
      const shouldBlock = shouldBlockCurrentSite();

      if (shouldBlock) {
        if (!existingStyle) {
          const selectors = getSelectorsForCurrentSite();
          if (selectors.length === 0) return;

          const css = selectors
            .map((s) => `${s} { display: none !important; }`)
            .join("\n");
          const style = document.createElement("style");
          style.id = STYLE_ID;
          style.textContent = css;
          document.head.appendChild(style);
          console.log("FeedFilter: Blocking enabled");
        }
      } else {
        if (existingStyle) {
          existingStyle.remove();
          console.log("FeedFilter: Blocking disabled");
        }
      }
    }

    // Initial load
    browser.storage.local.get("blockedSites").then((res) => {
      if (res.blockedSites) {
        currentBlockedSites = res.blockedSites as Record<string, boolean>;
        applyBlocking();
      }
    });

    // Listen for changes
    browser.storage.onChanged.addListener((changes) => {
      if (changes.blockedSites) {
        currentBlockedSites = changes.blockedSites.newValue as Record<
          string,
          boolean
        >;
        applyBlocking();
      }
    });

    // Watch for DOM changes to ensure style persists (some SPAs might clear head)
    const observer = new MutationObserver(() => {
      // Light check: only re-apply if we should be blocking and the style is gone
      if (shouldBlockCurrentSite() && !document.getElementById(STYLE_ID)) {
        applyBlocking();
      }
    });

    observer.observe(document.head, { childList: true });
  },
});
