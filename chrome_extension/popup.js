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

    // const coupleId = tree["ancestors"][0].coupleId;

    // gender = getGenderFromCoupleId(coupleId);

    ancestors = tree["ancestors"];
    greats = tree["ancestors"][3];

    const ancestry = {};
    let i = 0;
    for (const [key, great] of greats.entries()) {
        if (!great?.coupleId) {
            continue;
        }
        if (i++ >= 4) break;
        const origin1 = great?.parent1?.originCountry ?? "Unknown";
        ancestry[origin1] = (ancestry[origin1] || 0) + 1;

        const origin2 = great?.parent2?.originCountry ?? "Unknown";
        ancestry[origin2] = (ancestry[origin2] || 0) + 1;
    }

    console.log("Ancestry counts:", ancestry);
    const percentages = {};

    for (const [country, count] of Object.entries(ancestry)) {
        percentages[country] = (count / 8 * 100).toFixed(1);
    }

    console.log("Ancestry percentages:", percentages);

    const sorted = Object.entries(percentages)
    .sort((a, b) => parseFloat(b[1]) - parseFloat(a[1]));

    console.log("Sorted ancestry percentages:", sorted);
    displayAncestry(sorted);

}

function displayAncestry(sorted) {
    let text = "Estimated Ancestry:\n\n";
    for (const [country, pct] of sorted) {
        text += `${country}: ${pct}%\n`;
    }
    display(text);
}

async function askChatGPT() {
  const userPrompt = prompt("Enter your prompt:");

  if (!userPrompt) return;

  const openai_api_key = await chrome.storage.sync.get("openai_api_key").then(r => r.openai_api_key);

  const currentTree = await getFromStorage('currentTree');

  if (!openai_api_key) {
    display("ERROR: Missing OpenAI API key.");
    return;
  }

  if (!currentTree) {
    display("ERROR: No FamilySearch tree stored.");
    return;
  }

  display("Generating response...");

  chrome.runtime.sendMessage(
    {
      type: "generate",
      apiKey: openai_api_key,
      prompt: userPrompt,
      tree: currentTree
    },
    (response) => {
      if (!response?.success) {
        display("ERROR calling OpenAI:\n" + response?.error);
        return;
      }

      const text = response.result.choices?.[0]?.message?.content;

      display(text || "No content returned.");
    }
  );
}

function display(msg) {
  document.getElementById("responseBox").textContent = msg;
}