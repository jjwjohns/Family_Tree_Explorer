// If this becomes a published extension, this content script should use official developer APIs and not injection.
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

    chrome.storage.local.set({ currentTree: tree }, () => {
        console.log("Stored current ancestry");
    });
  }

  if (data.type === "ANCESTRY_ERROR") {
    console.warn("Error fetching ancestry:", data.error);
  }
});
