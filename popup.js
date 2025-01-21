document.addEventListener("DOMContentLoaded", () => {
  const siteDataTable = document.getElementById("siteData");

  // Fetch and display site data
  chrome.storage.local.get("siteData", (data) => {
    const siteData = data.siteData || {};
    siteDataTable.innerHTML = Object.entries(siteData)
      .map(([site, time]) => `<tr><td>${site}</td><td>${Math.round(time/60)}</td></tr>`)
      .join("");
  });
});

