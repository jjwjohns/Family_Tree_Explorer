console.log("BACKGROUND SERVICE WORKER LOADED");

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type !== "generate") return;

  console.log("Received request from popup:", msg);

  (async () => {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${msg.apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4.1-mini",
          messages: [
            { role: "system", content: "You analyze genealogy trees." },
            {
              role: "user",
              content:
                "Prompt:\n" +
                msg.prompt +
                "\n\nTree JSON:\n" +
                JSON.stringify(msg.tree)
            }
          ]
        })
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("OpenAI API Error:", data);
        sendResponse({
          success: false,
          error: data?.error?.message || "Unknown API error"
        });
        return;
      }

      console.log("OpenAI Response:", data);
      sendResponse({ success: true, result: data });

    } catch (err) {
      console.error("Network or Fetch Error:", err);
      sendResponse({ success: false, error: err?.message || String(err) });
    }
  })();

  // IMPORTANT: return true synchronously so Chrome keeps the message channel open
  return true;
});
