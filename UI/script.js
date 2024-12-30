const apiUrl = 'http://<k8s-service-url>/api/messages'; // Replace with your Kubernetes service URL
const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

// Fetch existing messages from the backend
async function fetchMessages() {
    try {
        const response = await fetch(apiUrl);
        const messages = await response.json();
        messagesDiv.innerHTML = '';
        messages.forEach(({ sender, content }) => {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message');
            messageElement.innerHTML = `<span>${sender}:</span> ${content}`;
            messagesDiv.appendChild(messageElement);
        });
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    } catch (error) {
        console.error('Error fetching messages:', error);
    }
}

// Send a new message to the backend
async function sendMessage() {
    const content = messageInput.value;
    if (!content.trim()) return;

    try {
        await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sender: 'User', content }),
        });
        messageInput.value = '';
        fetchMessages(); // Refresh the message list
    } catch (error) {
        console.error('Error sending message:', error);
    }
}

// Event listeners
sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

// Poll for new messages every 2 seconds
setInterval(fetchMessages, 2000);

// Initial fetch
fetchMessages();
