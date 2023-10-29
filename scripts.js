// Configuration for OpenAI API
const OPENAI_API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
const OPENAI_API_MODEL = "gpt-3.5-turbo";
const OPENAI_API_HEADERS = {
  'Authorization': 'Bearer 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',
  'Content-Type': 'application/json'
};

/**
 * Append a message to the chat window.
 * @param {string} sender - Sender's name ("User" or "Bot").
 * @param {string} content - The message content.
 */
function appendMessageToChat(sender, content) {
  const chatWindow = document.getElementById("chatWindow");
  const messageElement = document.createElement("div");
  messageElement.innerHTML = `${sender}: ${content}`;
  chatWindow.appendChild(messageElement);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

/**
 * Send a user message and retrieve a response from the bot.
 */
async function sendMessage() {
  const userInputElem = document.getElementById("userInput");
  const userInput = userInputElem.value;

  // Display the user's message in the chat window
  appendMessageToChat("User", userInput);

  // Placeholder for the bot's response
  const botPlaceholderElem = document.createElement("div");
  botPlaceholderElem.id = "botPlaceholder";
  botPlaceholderElem.innerHTML = 'Bot: <span class="blinking-underscore">_</span>';
  document.getElementById("chatWindow").appendChild(botPlaceholderElem);

  try {
    // Construct API request payload
    const payload = {
      model: OPENAI_API_MODEL,
      messages: [
        {
          role: "system",
          content: 
          `you are going to determine if you need additional context from the user to answer his question. 
          if you need additional information, you will ask for it using a HTML form. That mean you will write an 
          HTML form with all the information you need from the user to give the best possible answer.
          Use the following form elements when needed: text, submit, date, range, checkbox, file, radio, textarea, and select.`
        },
        {
          role: "user",
          content: userInput
        }
      ],
      temperature: 0.7
    };

    // Make API call
    const response = await axios.post(OPENAI_API_ENDPOINT, payload, { headers: OPENAI_API_HEADERS });

    // Extract bot's message from the API response
    const botResponse = response.data.choices[0].message.content;

    // Remove the placeholder and display the bot's response
    document.getElementById("chatWindow").removeChild(botPlaceholderElem);
    appendMessageToChat("Bot", botResponse);

  } catch (error) {
    console.error("Error while fetching bot response:", error);
  }

  // Clear the user input
  userInputElem.value = "";
}

