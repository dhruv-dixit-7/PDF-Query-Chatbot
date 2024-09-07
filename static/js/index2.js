const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const backBtn = document.getElementById("back-btn");
const homeBtn = document.getElementById("home-btn");

let userMessage = null;
const API_URL = "http://127.0.0.1:5000/web";
const inputInitHeight = chatInput.scrollHeight;

let stepStack = []; // To keep track of steps

document.addEventListener("DOMContentLoaded", function () {
    const getStartedBtn = document.getElementById("get-started-btn");
    const userInfoForm = document.getElementById("user-info-form");
    const chatInputWrapper = document.querySelector(".chat-input");

    getStartedBtn.addEventListener("click", function () {
        userInfoForm.style.display = "block";
        getStartedBtn.style.display = "none";
    });

    userInfoForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        userInfoForm.style.display = "none";
        showBotSelection();
    });

    backBtn.addEventListener("click", function () {
        goBack();
    });

    homeBtn.addEventListener("click", function () {
        goHome();
    });
});

const showBotSelection = () => {
    const botSelection = document.createElement("div");
    botSelection.classList.add("bot-selection");
    botSelection.innerHTML = `
            <p class="CityPara">Please choose your bot:</p>
            <button id="ai-bot-btn">AI Bot</button>
            <button id="click-bot-btn">Click Bot</button>
        `;
    chatbox.appendChild(botSelection);

    document.getElementById("ai-bot-btn").addEventListener("click", () => {
        stepStack.push(botSelection);
        botSelection.style.display = "none";
        document.querySelector(".chat-input").style.display = "block"; // Show chat input
        backBtn.style.display = "block"; // Show back button
        homeBtn.style.display = "block"; // Show home button
    });

    document.getElementById("click-bot-btn").addEventListener("click", () => {
        stepStack.push(botSelection);
        botSelection.style.display = "none";
        showCityOptions();
        backBtn.style.display = "block"; // Show back button
        homeBtn.style.display = "block"; // Show home button
    });
};

const showCityOptions = async () => {
    try {
        const response = await fetch("http://127.0.0.1:5000/cities", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();

        console.log("Response===>", data);

        if (Array.isArray(data)) {
            const cityOptions = document.createElement("div");
            cityOptions.classList.add("city-options");
            cityOptions.innerHTML = `<p>Please choose your city:</p>`;
            data.forEach((city, index) => {
                cityOptions.innerHTML += `<button class="city-btn" data-city-id="${index}">${city}</button>`;
            });
            chatbox.appendChild(cityOptions);
            stepStack.push(cityOptions); // Push current step to stack
            document.querySelectorAll(".city-btn").forEach((button) => {
                button.addEventListener("click", (event) => {
                    const cityId = event.target.getAttribute("data-city-id");
                    cityOptions.style.display = "none";
                    showColonyOptions(cityId);
                });
            });
        } else {
            console.error("Invalid response format:", data);
        }
    } catch (error) {
        console.error("Error:", error);
    }
};

const showColonyOptions = async (cityId) => {
    try {
        const response = await fetch(`http://127.0.0.1:5000/colonies/${cityId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();

        console.log("Response===>", data);

        if (Array.isArray(data)) {
            const colonyOptions = document.createElement("div");
            colonyOptions.classList.add("colony-options");
            colonyOptions.innerHTML = `<p>Please choose your colony:</p>`;
            data.forEach((colony, index) => {
                colonyOptions.innerHTML += `<button class="colony-btn" data-colony-id="${index}">${colony}</button>`;
            });
            chatbox.appendChild(colonyOptions);
            stepStack.push(colonyOptions); // Push current step to stack
            document.querySelectorAll(".colony-btn").forEach((button) => {
                button.addEventListener("click", (event) => {
                    const colonyId = event.target.getAttribute("data-colony-id");
                    colonyOptions.style.display = "none";
                    showSizeOptions(colonyId);
                });
            });
        } else {
            console.error("Invalid response format:", data);
        }
    } catch (error) {
        console.error("Error:", error);
    }
};

const showSizeOptions = async (colonyId) => {
    try {
        const response = await fetch(`http://127.0.0.1:5000/sizes/${colonyId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        console.log("Response===>", data);

        if (Array.isArray(data)) {
            const sizeOptions = document.createElement("div");
            sizeOptions.classList.add("size-options");
            sizeOptions.innerHTML = `<p>Please choose your size:</p>`;
            data.forEach((size, index) => {
                sizeOptions.innerHTML += `<button class="size-btn" data-size-id="${index}">${size}</button>`;
            });
            chatbox.appendChild(sizeOptions);
            stepStack.push(sizeOptions); // Push current step to stack
            document.querySelectorAll(".size-btn").forEach((button) => {
                button.addEventListener("click", (event) => {
                    const sizeId = event.target.getAttribute("data-size-id");
                    sizeOptions.style.display = "none";
                    showHelpOptions(sizeId);
                });
            });
        } else {
            console.error("Invalid response format:", data);
        }
    } catch (error) {
        console.error("Error:", error);
    }
};

const showHelpOptions = async (sizeId) => {
    try {
        const response = await fetch(`http://127.0.0.1:5000/helps/${sizeId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        console.log("Response===>", data);

        const helpOptions = document.createElement("div");
        helpOptions.classList.add("help-options");
        helpOptions.innerHTML = `<p>Please choose your help:</p>`;
        data.forEach((help, index) => {
            helpOptions.innerHTML += `<button class="help-btn" data-help-id="${index}">${help}</button>`;
        });
        chatbox.appendChild(helpOptions);
        stepStack.push(helpOptions); // Push current step to stack
        document.querySelectorAll(".help-btn").forEach((button) => {
            button.addEventListener("click", (event) => {
                const helpId = event.target.getAttribute("data-help-id");
                helpOptions.style.display = "none";
                showSolutionOptions(helpId);
            });
        });
    } catch (error) {
        console.error("Error:", error);
    }
};

const showSolutionOptions = async (helpId) => {
    console.log("help id: " + helpId);
    try {
        const response = await fetch(
            `http://127.0.0.1:5000/fetch_solution_by_help/${helpId}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        const data = await response.json();
        console.log("Response===>", data);
        const solutionOptions = document.createElement("div");
        solutionOptions.classList.add("solution-options");
        solutionOptions.innerHTML = `<p>Here are your solutions:</p>`;
        data.forEach((solution, index) => {
            solutionOptions.innerHTML += `<p>${solution}₹</p>`;
        });
        chatbox.appendChild(solutionOptions);
        stepStack.push(solutionOptions); // Push current step to stack
    } catch (error) {
        console.error("Error:", error);
    }
};

const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", `${className}`);
    let chatContent = `<p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
};

const generateResponse = async (chatElement, message) => {
    const dataTosend = { question: message };
    const messageElement = chatElement.querySelector("p");

    console.log("question ===>", dataTosend);

    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataTosend),
    };

    try {
        const response = await fetch(API_URL, requestOptions);
        const data = await response.json();
        if (data && data.response) {
            messageElement.textContent = data.response;
        } else {
            throw new Error("No response received from server");
        }
    } catch (error) {
        console.error("Error:", error);
        messageElement.classList.add("error");
        messageElement.textContent =
            "Oops! Something went wrong. Please try again.";
    } finally {
        chatbox.scrollTo(0, chatbox.scrollHeight);
    }
};

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;

    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi, userMessage);
    }, 600);
};

chatInput.addEventListener("input", () => {
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});

sendChatBtn.addEventListener("click", handleChat);

chatbotToggler.addEventListener("click", () => {
    document.body.classList.toggle("show-chatbot");
});

closeBtn.addEventListener("click", () => {
    document.body.classList.remove("show-chatbot");
});

const goBack = () => {
    if (stepStack.length > 0) {
        const lastStep = stepStack.pop();
        lastStep.style.display = "none";
        if (stepStack.length > 0) {
            stepStack[stepStack.length - 1].style.display = "block";
        } else {
            document.querySelector(".bot-selection").style.display = "block";
            backBtn.style.display = "none"; // Hide back button on bot selection
            homeBtn.style.display = "none"; // Hide home button on bot selection
        }
    }
};

const goHome = () => {
    while (stepStack.length > 0) {
        const step = stepStack.pop();
        step.style.display = "none";
    }
    document.querySelector(".bot-selection").style.display = "block";
    backBtn.style.display = "none"; // Hide back button on home
    homeBtn.style.display = "none"; // Hide home button on home
};