// If this becomes a published extension, this injection script should be removed and official developer APIs used.

console.log("injected.js running");

function getPersonIdFromUrl() {
  const match = window.location.href.match(/[A-Z0-9]{4}-[A-Z0-9]{3}/i);
  return match ? match[0].toUpperCase() : null;
}

function post(msg) {
  window.postMessage({ source: "FTA_INJECTED", ...msg }, "*");
}

async function fetchAncestry(pid) {
  if (!pid) return;

  const url = `/service/tree/tree-data/r9/portrait-pedigree/${pid}?numGenerations=9&includeCountries=true&includeRecordHints=true&includeSources=true&includeParentHints=true&includePhotos=false&includeMarriages=false`;

  try {
    console.log("Fetching ancestry tree:", url);
    const res = await fetch(url, { method: "GET" });

    if (!res.ok) {
      post({ type: "ANCESTRY_ERROR", error: `HTTP ${res.status}` });
      return;
    }

    const json = await res.json();

    post({ type: "ANCESTRY_LOADED", personId: pid, tree: json });
  } catch (err) {
    post({ type: "ANCESTRY_ERROR", error: String(err) });
  }
}

let lastPid = null;

function detectChange() {
  const pid = getPersonIdFromUrl();
  if (!pid || pid === lastPid) return;

  lastPid = pid;
  console.log("Detected person change:", pid);

  fetchAncestry(pid);
}

new MutationObserver(() => {
  requestAnimationFrame(detectChange);
}).observe(document.body, { childList: true, subtree: true });

// Also detect history changes
(function () {
  const origPush = history.pushState;
  history.pushState = function () {
    const r = origPush.apply(this, arguments);
    detectChange();
    return r;
  };
  const origReplace = history.replaceState;
  history.replaceState = function () {
    const r = origReplace.apply(this, arguments);
    detectChange();
    return r;
  };
  window.addEventListener("popstate", detectChange);
})();

// Initial load
detectChange();
