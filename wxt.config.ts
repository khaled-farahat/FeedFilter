import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    permissions: ["storage"],
    host_permissions: [
      "*://*.youtube.com/*",
      "*://*.twitter.com/*",
      "*://*.x.com/*",
      "*://*.facebook.com/*",
      "*://*.instagram.com/*",
      "*://*.linkedin.com/*",
      "*://*.reddit.com/*",
    ],
    options_ui: {
      page: "options.html",
      open_in_tab: true,
    },
  },
  modules: ["@wxt-dev/module-react"],
  srcDir: "src",
});
