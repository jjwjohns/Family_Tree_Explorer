console.log("Content script loaded");

// Function to extract person ID from URL
function getPersonIdFromUrl() {
    const match = window.location.pathname.match(/[A-Z0-9]{4}-[A-Z0-9]{3}/i);
    return match ? match[0] : null;
}

let lastPersonId = null;

// Checking for person ID changes. If changed, process it.
function processPersonId() {
    const id = getPersonIdFromUrl();
    if (id && id !== lastPersonId) {
        lastPersonId = id;
        console.log("Detected person ID:", id);
        // TODO: Your tree logic here
    }
}
processPersonId();

const observer = new MutationObserver(processPersonId);

observer.observe(document.body, {
    childList: true,
    subtree: true
});
