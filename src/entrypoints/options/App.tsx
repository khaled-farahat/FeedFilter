import { useState, useEffect } from "react";
import "./App.css";
import { sites } from "@/features/sites";

interface SiteSettings {
  blockFeed: boolean;
  [key: string]: boolean;
}

interface Settings {
  [siteId: string]: SiteSettings;
}

// Default settings if none exist
const DEFAULT_SITE_SETTINGS: SiteSettings = {
  blockFeed: true,
};

function App() {
  const [selectedSiteId, setSelectedSiteId] = useState<string>(sites[0].id);
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);

  // Load settings from storage
  useEffect(() => {
    browser.storage.local.get(["siteSettings", "blockedSites"]).then((res) => {
      let initialSettings: Settings = {};

      if (res.siteSettings) {
        initialSettings = res.siteSettings as Settings;
      } else if (res.blockedSites) {
        // Migration logic for old structure
        const oldBlocked = res.blockedSites as Record<string, boolean>;
        const newSettings: Settings = {};
        sites.forEach((site) => {
          newSettings[site.id] = { blockFeed: !!oldBlocked[site.id] };
        });
        initialSettings = newSettings;
      }

      // Ensure every site has at least a default entry
      sites.forEach((site) => {
        if (!initialSettings[site.id]) {
          initialSettings[site.id] = {
            ...DEFAULT_SITE_SETTINGS,
            blockFeed: false,
          };
        }
      });

      setSettings(initialSettings);
      setLoading(false);
    });
  }, []);

  const handleSiteSelect = (siteId: string) => {
    setSelectedSiteId(siteId);
  };

  const updateSetting = (siteId: string, outputKey: string, value: boolean) => {
    const currentSiteSettings = settings[siteId] || {
      ...DEFAULT_SITE_SETTINGS,
    };
    const newSiteSettings = { ...currentSiteSettings, [outputKey]: value };

    const newSettings = {
      ...settings,
      [siteId]: newSiteSettings,
    };

    setSettings(newSettings);
    browser.storage.local.set({ siteSettings: newSettings });
  };

  if (loading) {
    return <div className="loading">Loading settings...</div>;
  }

  const selectedSite = sites.find((s) => s.id === selectedSiteId) || sites[0];
  const siteSettings = settings[selectedSiteId] || { blockFeed: false };

  return (
    <div className="options-container">
      <aside className="sidebar">
        <div className="logo-area">
          <h2>Feed Filter</h2>
          <span className="version">v0.1.0</span>
        </div>
        <nav>
          {sites.map((site) => (
            <button
              key={site.id}
              className={`nav-item ${selectedSiteId === site.id ? "active" : ""}`}
              onClick={() => handleSiteSelect(site.id)}
            >
              {site.name}
            </button>
          ))}
        </nav>
      </aside>

      <main className="content-area">
        <header className="content-header">
          <h1>{selectedSite.name} Settings</h1>
          <p className="subtitle">
            Customize what you see on {selectedSite.name}
          </p>
        </header>

        <div className="settings-group">
          <div className="setting-item">
            <div className="setting-info">
              <h3>Block News Feed</h3>
              <p>Hide the main algorithmic feed on the homepage.</p>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={siteSettings.blockFeed}
                onChange={(e) =>
                  updateSetting(selectedSiteId, "blockFeed", e.target.checked)
                }
              />
              <span className="slider round"></span>
            </label>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
