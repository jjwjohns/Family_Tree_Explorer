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

async function estimateAncestry() {
  console.log("Estimating ancestry...");
  // Implementation for ancestry estimation goes here
}

async function askChatGPT() {
  console.log("Asking ChatGPT...");
  // Implementation for ChatGPT interaction goes here
}