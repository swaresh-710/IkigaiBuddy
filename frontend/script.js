const chatMessages = document.getElementById('chat-messages');
const userInputForm = document.getElementById('user-input-form');
const userInput = document.getElementById('user-input');

const questions = [
    "What activities do you love doing?",
    "What are you skilled at?",
    "What does the world need?",
    "What can you be paid for?"
];

let currentQuestion = 0;
let userResponses = [];

function addMessage(message, isBot = false) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.classList.add(isBot ? 'bot-message' : 'user-message');
    messageElement.textContent = message;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function askQuestion() {
    if (currentQuestion < questions.length) {
        setTimeout(() => {
            addMessage(questions[currentQuestion], true);
        }, 500);
    } else {
        setTimeout(() => {
            addMessage("Thank you for your responses. I'm analyzing your Ikigai now...", true);
            sendResponsesToBackend();
        }, 500);
    }
}

async function sendResponsesToBackend() {
    addMessage("Analyzing your responses...", true);
    try {
        const response = await fetch('http://localhost:3000/analyze-ikigai', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ responses: userResponses }),
        });

        if (!response.ok) {
            throw new Error('Failed to analyze Ikigai');
        }

        const data = await response.json();
        addMessage("Analysis complete! Here's a summary:", true);
        data.analysis.split('\n\n').forEach((paragraph, index) => {
            setTimeout(() => {
                addMessage(paragraph, true);
            }, index * 1000);
        });
        setTimeout(() => {
            addMessage("A detailed analysis has been generated. You can download it here: [Download Link]", true);
        }, data.analysis.split('\n\n').length * 1000);
    } catch (error) {
        console.error('Error:', error);
        addMessage("Sorry, an error occurred while analyzing your Ikigai. Please try again later.", true);
    }
}

userInputForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const userMessage = userInput.value.trim();
    if (userMessage) {
        addMessage(userMessage);
        userResponses.push(userMessage);
        userInput.value = '';
        currentQuestion++;
        askQuestion();
    }
});

// Start the conversation
addMessage("Welcome to the Ikigai Buddy! I'll ask you a few questions to help find your Ikigai. Keep it as detailed & Candid as possible", true);
askQuestion();