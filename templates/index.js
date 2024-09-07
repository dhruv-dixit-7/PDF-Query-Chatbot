const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");

let userMessage = null; // Variable to store user's message
const API_KEY = "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"; // Paste your API key here
const inputInitHeight = chatInput.scrollHeight;

document.addEventListener("DOMContentLoaded", function() {
    const getStartedBtn = document.getElementById("get-started-btn");
    const userInfoForm = document.getElementById("user-info-form");
    const chatInputWrapper = document.querySelector(".chat-input");

    getStartedBtn.addEventListener("click", function() {
        // Show the user info form and hide the "Get Started" button
        userInfoForm.style.display = "block";
        getStartedBtn.style.display = "none";
    });

    // AI button and click bot button 

    // userInfoForm.addEventListener("submit"), function(event){
    //     event.preventDefault();

    //     const name = document.getElementById("name").value;
    //     const email = document.getElementById("email").value;
    // }

    userInfoForm.addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent the form from submitting normally

        // Retrieve user's name and email from the form
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;

        // You can handle the user's name and email data as needed
        console.log("Name:", name);
        console.log("Email:", email);

        // Hide the user info form after submission
        userInfoForm.style.display = "none";

        // Show the bot selection options
        const botSelection = document.createElement("div");
        botSelection.classList.add("bot-selection");
        botSelection.innerHTML = `
            <p class="CityPara">Please choose your bot:</p>
            <button id="ai-bot-btn">AI Bot</button>
            <button id="click-bot-btn">Click Bot</button>
        `;
        chatbox.appendChild(botSelection);

        // Add event listeners to the bot selection buttons
        document.getElementById("ai-bot-btn").addEventListener("click", () => {
            botSelection.style.display = "none";
            chatInputWrapper.style.display = "block";
            // Proceed with AI bot interactions
        });

        document.getElementById("click-bot-btn").addEventListener("click", () => {
            botSelection.style.display = "none";
            showCityOptions();
        });
    });
});



const showCityOptions = () => {
    const cityOptions = document.createElement("div");
    cityOptions.classList.add("city-options");
    cityOptions.innerHTML = `
        <p>Please choose your city:</p>
        <button class="city-btn" data-city="Delhi">Delhi</button>
        <button class="city-btn" data-city="Goa">Goa</button>
        <br>
        <button class="city-btn" data-city="Mumbai">Mumbai</button>
        <button class="city-btn" data-city="Chennai">Chennai</button>
    `;
    chatbox.appendChild(cityOptions);

    // Add event listeners to the city selection buttons
    document.querySelectorAll(".city-btn").forEach(button => {
        button.addEventListener("click", (event) => {
            const city = event.target.getAttribute("data-city");
            console.log("City chosen:", city);
            // Handle the city selection as needed
            cityOptions.style.display = "none";
            document.querySelector(".chat-input").style.display = "block";
        });
    });
};

const createChatLi = (message, className) => {
    // Create a chat <li> element with passed message and className
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", `${className}`);
    let chatContent = className === "outgoing" ? `<p></p>` : `<p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi; // return chat <li> element
}

const generateResponse =  async (chatElement, message) => {
    console.log("chat element", chatElement);
    // const API_URL = "http://127.0.0.1:5000/";
    const API_URL = "http://127.0.0.1:5000/web";
    const dataTosend = { question: message };
    const messageElement = chatElement.querySelector("p");

    // Define the properties and message for the API request
    const requestOptions = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataTosend),
        redirect: "follow"
    };

    // Send POST request to API, get response and set the response as paragraph text
    await fetch(API_URL, requestOptions)
        .then(res => res.json())
        .then(data => {
            console.log("data", data);
            if (data && data.response) {
                messageElement.textContent = data.response;
            } else {
                throw new Error("No response received from server");
            }
        })
        .catch((error) => {
            console.error("Error:", error);
            messageElement.classList.add("error");
            messageElement.textContent = "Oops! Something went wrong. Please try again.";
        })
        .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
}

const handleChat = () => {
    userMessage = chatInput.value.trim(); // Get user entered message and remove extra whitespace
    if (!userMessage) return;

    // Clear the input textarea and set its height to default
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    // Append the user's message to the chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);
    
    setTimeout(() => {
        // Display "Thinking..." message while waiting for the response
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi, userMessage);
    }, 600);
}

chatInput.addEventListener("input", () => {
    // Adjust the height of the input textarea based on its content
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    // If Enter key is pressed without Shift key and the window 
    // width is greater than 800px, handle the chat
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});

sendChatBtn.addEventListener("click", handleChat);
closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
