"use strict";

const blocked = [
  {
    host: "www.instagram.com",
    pathname: "/reels/",
  },
  {
    host: "www.tiktok.com",
    pathname: "/",
  },
  {
    host: "www.youtube.com",
    pathname: "/shorts/",
  },
];

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo) {
  chrome.tabs.get(tabId, function (tab) {
    if (!tab) return;

    const url = new URL(tab.url);
    if (!url || url.protocol != "https:") return;

    if (
      blocked.some(
        (domain) =>
          url.host.includes(domain.host) &&
          url.pathname.includes(domain.pathname)
      )
    ) {
      chrome.tabs.update(tabId, { url: "https://www.google.com" });
    } else if (blocked.some((domain) => url.host.includes(domain.host))) {
      switch (url.host) {
        case "www.instagram.com":
          break;
        case "www.youtube.com":
          chrome.scripting.executeScript({
            target: { tabId: tabId },
            function: () => {
              document.querySelectorAll("#dismissible").forEach((el) => {
                el.remove();
                console.log("removed shorts panel");
              });
              document.querySelectorAll("#endpoint").forEach((el) => {
                if (
                  el.hasAttribute("title") &&
                  el.getAttribute("title").includes("Shorts")
                ) {
                  el.remove();
                  console.log("removed shorts section on the navbar");
                }
              });
            },
          });
          break;
      }
    }
  });
});
