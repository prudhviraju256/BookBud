const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  addMessage(message, "user");
  userInput.value = "";

  addMessage("Typing...", "ai");

  try {
    const response = await getAIResponse(message);
    updateLastAIMessage(response);
  } catch (error) {
    updateLastAIMessage("Sorry, I couldn't reach the AI.");
    console.error("Error:", error);
  }
}

function addMessage(message, type) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message", type);
  msgDiv.innerText = message;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function updateLastAIMessage(newText) {
  const aiMessages = document.querySelectorAll(".message.ai");
  if (aiMessages.length) {
    aiMessages[aiMessages.length - 1].innerText = newText;
  }
}

async function getAIResponse(userInput) {
  const apiKey ="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"; // Replace with your OpenRouter API key

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
      "HTTP-Referer": "http://localhost", // Replace with your domain when deploying
      "X-Title": "Book Recommender"
    },
    body: JSON.stringify({
      model: "openchat/openchat-7b:free", // Correct model ID for OpenChat 3.5 (free version)
      messages: [
        { role: "system", content: "You are a helpful book recommendation assistant." },
        { role: "user", content: userInput },
      ],
      temperature: 0.7,
    })
  });

  const data = await response.json();
  return data.choices[0].message.content.trim();
}
