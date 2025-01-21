let activeTab = null;
let startTime = null;
let siteData = {};
let isUserIdle = false;


// Load existing data from storage when the extension starts
chrome.storage.local.get("siteData", (data) => {
  siteData = data.siteData || {};
  console.log("Loaded site data:", siteData);
});

// Track tab changes
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  handleTabChange(tab);
});

// Track URL changes
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.active && changeInfo.url) {
    handleTabChange(tab);
  }
});

// Detect user idle state
chrome.idle.onStateChanged.addListener((newState) => {
  if (newState === "idle" || newState === "locked") {
    // User is idle, stop tracking time
    stopTracking();
    isUserIdle = true;
  } else if (newState === "active") {
    // User is active, resume tracking
    isUserIdle = false;
    startTracking();
  }
});

// Handle tab change logic
function handleTabChange(tab) {
  if (isUserIdle) return; // Do not track if user is idle

  const now = Date.now();

  // Save time spent on the previous site
  if (activeTab && startTime) {
    const timeSpent = Math.floor((now - startTime) / 1000);
    siteData[activeTab] = (siteData[activeTab] || 0) + timeSpent;
  }

  try {
  // Update active tab and start time
  activeTab = new URL(tab.url).hostname;
  startTime = now;
    } catch (e) {}
}

// Stop tracking time
function stopTracking() {
  const now = Date.now();
  if (activeTab && startTime) {
    const timeSpent = Math.floor((now - startTime) / 1000);
    siteData[activeTab] = (siteData[activeTab] || 0) + timeSpent;
  }
  startTime = null; // Reset start time
}

// Start tracking time
function startTracking() {
  startTime = Date.now();
}

// Save data to storage every minute
setInterval(() => {
  const now = Date.now();
  if (activeTab && startTime) {
    const timeSpent = Math.floor((now - startTime) / 1000);
    siteData[activeTab] = (siteData[activeTab] || 0) + timeSpent;
  startTime = now; // Reset start time 
  }
  console.log(siteData)
  chrome.storage.local.set({ siteData });
}, 60000);
