document.addEventListener('DOMContentLoaded', () => {
    const ids = ['estimate', 'ChatGPT'];
    ids.forEach(id => {
        const btn = document.getElementById(id);
        if (!btn) return;
        btn.addEventListener('click', () => {
        console.log(`popup button "${id}" clicked`, { id, time: new Date().toISOString() });
        if (id === 'estimate') {
            estimateAncestry();
        } else if (id === 'ChatGPT') {
            askChatGPT();
        }
        });
    });
});

function getFromStorage(key) {
  return new Promise(resolve => {
    chrome.storage.local.get([key], result => resolve(result[key]));
  });
}

async function estimateAncestry() {
    const tree = await getFromStorage('currentTree');
    if (!tree) {
        console.warn("No current tree data available for estimation.");
        return;
    }
    console.log("Estimating ancestry...");

    ancestors = tree["ancestors"];
    first_ancestor = tree["ancestors"][0][0];
    id = tree["ancestors"][0][0].coupleId;
    console.log("Current Person ID:", id);
    console.log("First Ancestor Data:", first_ancestor);
    console.log("Total Ancestors Retrieved:", ancestors.length);
    console.log("Full Ancestor List:", ancestors);
    console.log("Tree Data:", tree);


    // Implementation for ancestry estimation goes here
}

async function askChatGPT() {
    console.log("Asking ChatGPT...");
    // Implementation for ChatGPT interaction goes here
}