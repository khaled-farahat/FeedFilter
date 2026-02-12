import { useState, useEffect } from "react";
import "./App.css";

const SITES = [
  { id: "youtube", name: "YouTube" },
  { id: "twitter", name: "X (Twitter)" },
  { id: "facebook", name: "Facebook" },
  { id: "instagram", name: "Instagram" },
  { id: "linkedin", name: "LinkedIn" },
  { id: "reddit", name: "Reddit" },
];

function App() {
  const [blockedSites, setBlockedSites] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Load initial state
    browser.storage.local.get("blockedSites").then((res) => {
      if (res.blockedSites) {
        setBlockedSites(res.blockedSites as Record<string, boolean>);
      }
    });
  }, []);

  const toggleSite = (siteId: string) => {
    const newBlockedSites = {
      ...blockedSites,
      [siteId]: !blockedSites[siteId],
    };
    setBlockedSites(newBlockedSites);
    browser.storage.local.set({ blockedSites: newBlockedSites });
  };

  return (
    <div className="container">
      <h1>Feed Filter</h1>
      <p className="description">Toggle feeds to block:</p>
      <div className="site-list">
        {SITES.map((site) => (
          <div key={site.id} className="site-item">
            <label htmlFor={site.id}>{site.name}</label>
            <label className="switch">
              <input
                type="checkbox"
                id={site.id}
                checked={!!blockedSites[site.id]}
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
