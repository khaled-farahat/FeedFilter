import { useState, useEffect } from "react";
import "./App.css";
import { sites } from "@/features/sites";
import { SiteConfig } from "@/features/sites/types";

interface SiteSettings {
  blockFeed: boolean;
  [key: string]: boolean;
}

interface Settings {
  [siteId: string]: SiteSettings;
}

function App() {
  const [settings, setSettings] = useState<Settings>({});

  useEffect(() => {
    // Load initial state
    browser.storage.local.get(["siteSettings", "blockedSites"]).then((res) => {
      if (res.siteSettings) {
        setSettings(res.siteSettings as Settings);
      } else if (res.blockedSites) {
        // Migration logic if options page hasn't been opened yet
        const oldBlocked = res.blockedSites as Record<string, boolean>;
        const newSettings: Settings = {};
        sites.forEach((site) => {
          newSettings[site.id] = { blockFeed: !!oldBlocked[site.id] };
        });
        setSettings(newSettings);
      }
    });
  }, []);

  const toggleSite = (siteId: string) => {
    const currentSiteSettings = settings[siteId] || { blockFeed: false };
    const newSiteSettings = {
      ...currentSiteSettings,
      blockFeed: !currentSiteSettings.blockFeed,
    };

    const newSettings = {
      ...settings,
      [siteId]: newSiteSettings,
    };

    setSettings(newSettings);
    browser.storage.local.set({ siteSettings: newSettings });
  };

  const openOptions = () => {
    // Explicitly open in a new tab to ensure full page view
    browser.tabs.create({ url: browser.runtime.getURL("/options.html") });
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Feed Filter</h1>
        <button className="icon-btn" onClick={openOptions} title="Settings">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
        </button>
      </div>
      <p className="description">Toggle feeds to block:</p>
      <div className="site-list">
        {sites.map((site) => (
          <div key={site.id} className="site-item">
            <label htmlFor={site.id}>{site.name}</label>
            <label className="switch">
              <input
                type="checkbox"
                id={site.id}
                checked={settings[site.id]?.blockFeed ?? false}
                onChange={() => toggleSite(site.id)}
              />
              <span className="slider round"></span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
