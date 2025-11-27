// content.js
console.log("content script loaded");

(function injectInjectedScript() {
  const script = document.createElement("script");
  script.src = chrome.runtime.getURL("injected.js");
  script.type = "text/javascript";

  (document.head || document.documentElement).appendChild(script);

  script.onload = () => {
    script.remove();
  };
})();

window.addEventListener("message", (event) => {
  // Only accept messages from same window, not iframes or other extensions
  if (event.source !== window) return;

  const data = event.data;
  if (!data || data.source !== "FTA_INJECTED") return;


  if (data.type === "ANCESTRY_LOADED") {
    const { personId, tree } = data;
    console.log("Received ancestry for:", personId, tree);

    chrome.storage.local.get(["trees"], (res) => {
      const trees = res.trees || {};
      trees[personId] = tree;

      chrome.storage.local.set({ trees }, () => {
        console.log("Stored ancestry for:", personId);
      });
    });
  }

  if (data.type === "ANCESTRY_ERROR") {
    console.warn("Error fetching ancestry:", data.error);
  }
});
