// Chatbot functionality
class Chatbot {
    constructor() {
        this.container = document.getElementById('chatbotContainer');
        this.toggle = document.getElementById('chatbotToggle');
        this.close = document.getElementById('chatbotClose');
        this.messagesContainer = document.getElementById('chatbotMessages');
        this.input = document.getElementById('chatbotInput');
        this.sendBtn = document.getElementById('chatbotSend');
        this.typingIndicator = document.getElementById('chatbotTyping');
        this.faqSection = document.getElementById('chatbotFaq');
        this.isOpen = false;
        this.conversationHistory = [];

        this.init();
    }

    init() {
        // Toggle chatbot
        this.toggle.addEventListener('click', () => this.openChatbot());
        this.close.addEventListener('click', () => this.closeChatbot());

        // Send message on button click
        this.sendBtn.addEventListener('click', () => this.sendMessage());

        // Send message on Enter key
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Handle FAQ button clicks
        const faqButtons = document.querySelectorAll('.faq-btn');
        faqButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const question = btn.getAttribute('data-question');
                this.input.value = question;
                this.sendMessage();
            });
        });

        // Close on outside click (optional)
        document.addEventListener('click', (e) => {
            if (this.isOpen && 
                !this.container.contains(e.target) && 
                !this.toggle.contains(e.target)) {
                // Uncomment to close on outside click
                // this.closeChatbot();
            }
        });
    }

    openChatbot() {
        this.container.classList.add('active');
        this.isOpen = true;
        this.input.focus();
        
        // Show FAQ section if no messages have been sent yet
        if (this.conversationHistory.length === 0 && this.faqSection) {
            this.faqSection.classList.remove('hidden');
        }
    }

    closeChatbot() {
        this.container.classList.remove('active');
        this.isOpen = false;
    }

    addMessage(content, isUser = false) {
        // Hide FAQ section when user sends first message
        if (isUser && this.faqSection && !this.faqSection.classList.contains('hidden')) {
            this.faqSection.classList.add('hidden');
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = isUser 
            ? '<i class="fas fa-user"></i>' 
            : '<i class="fas fa-robot"></i>';

        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        const p = document.createElement('p');
        
        // Format message content (support markdown-like formatting)
        p.innerHTML = this.formatMessage(content);
        messageContent.appendChild(p);

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);

        this.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
    }

    formatMessage(text) {
        // Convert markdown-like formatting to HTML
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/\n/g, '<br>');
    }

    showTyping() {
        this.typingIndicator.style.display = 'flex';
        this.scrollToBottom();
    }

    hideTyping() {
        this.typingIndicator.style.display = 'none';
    }

    scrollToBottom() {
        setTimeout(() => {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }, 100);
    }

    async sendMessage() {
        const message = this.input.value.trim();
        if (!message || this.sendBtn.disabled) return;

        // Add user message to UI
        this.addMessage(message, true);
        this.input.value = '';
        this.sendBtn.disabled = true;
        this.input.disabled = true;

        // Add to conversation history
        this.conversationHistory.push({
            role: 'user',
            content: message
        });

        // Show typing indicator
        this.showTyping();

        try {
            // Send to backend
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    history: this.conversationHistory
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to get response');
            }

            // Hide typing indicator
            this.hideTyping();

            // Add bot response to UI
            this.addMessage(data.response, false);

            // Add to conversation history
            this.conversationHistory.push({
                role: 'assistant',
                content: data.response
            });

            // Keep conversation history manageable (last 10 messages)
            if (this.conversationHistory.length > 20) {
                this.conversationHistory = this.conversationHistory.slice(-20);
            }

        } catch (error) {
            console.error('Chatbot error:', error);
            this.hideTyping();
            this.addMessage('Sorry, I encountered an error. Please try again or check your API configuration.', false);
        } finally {
            this.sendBtn.disabled = false;
            this.input.disabled = false;
            this.input.focus();
        }
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Chatbot();
});

