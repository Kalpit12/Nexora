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
        this.qaPairs = this.buildKnowledgeBase();

        this.init();
    }

    init() {
        // Toggle chatbot
        this.toggle.addEventListener('click', () => {
            if (this.isOpen) this.closeChatbot();
            else this.openChatbot();
        });
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

        // Keep wheel/touch scroll inside the chat (Lenis otherwise steals it)
        if (this.messagesContainer) {
            const stopPageScroll = (e) => e.stopPropagation();
            this.messagesContainer.addEventListener('wheel', stopPageScroll, { passive: true });
            this.messagesContainer.addEventListener('touchmove', stopPageScroll, { passive: true });
        }

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
        this.toggle.classList.add('is-open');
        this.toggle.setAttribute('aria-label', 'Close Nexy chat');
        this.isOpen = true;
        this.input.focus();

        // Pause page smooth-scroll so the chat panel can scroll natively
        if (window.lenis && typeof window.lenis.stop === 'function') {
            window.lenis.stop();
        }
        
        // Show FAQ section if no messages have been sent yet
        if (this.conversationHistory.length === 0 && this.faqSection) {
            this.faqSection.classList.remove('hidden');
        }
    }

    closeChatbot() {
        this.container.classList.remove('active');
        this.toggle.classList.remove('is-open');
        this.toggle.setAttribute('aria-label', 'Open Nexy chat');
        this.isOpen = false;

        if (window.lenis && typeof window.lenis.start === 'function') {
            window.lenis.start();
        }
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
        avatar.setAttribute('aria-hidden', 'true');
        avatar.textContent = isUser ? 'You' : 'N';
        if (isUser) {
            avatar.style.fontSize = '0.55rem';
            avatar.style.letterSpacing = '0';
        }

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

    buildKnowledgeBase() {
        return [
            {
                triggers: ['services', 'what services', 'offer'],
                response: `We offer:
- Full-stack web development
- Frontend and backend development
- E-commerce websites
- Website redesigns
- AI lead automation systems
- Events/job platform development
- SEO optimization
- Website maintenance and support`
            },
            {
                triggers: ['price', 'cost', 'pricing', 'budget', 'how much'],
                response: `Our typical pricing:
- Starter websites: from KES 50,000
- Professional business websites: from KES 120,000
- E-commerce and custom systems: from KES 150,000+
- Advanced platforms (job portals/events/automation): custom quote based on scope.

You can also use the Instant Estimate form on this page for a quick budget range.`
            },
            {
                triggers: ['timeline', 'how long', 'delivery', 'duration'],
                response: `Typical timelines:
- Basic website: 2-4 weeks
- Professional website: 4-6 weeks
- Complex web app or platform: 8-12+ weeks

Exact timelines depend on features, integrations, and feedback speed.`
            },
            {
                triggers: ['process', 'how you work', 'steps', 'workflow'],
                response: `Our process:
1) Discovery & planning
2) Strategy & wireframing
3) UI/UX design
4) Development
5) Testing & optimization
6) Launch
7) Post-launch support`
            },
            {
                triggers: ['maintenance', 'support', 'after launch'],
                response: `Yes, we provide post-launch maintenance:
- Security updates and patches
- Performance monitoring
- Backups
- Content updates
- Technical support

We also include free initial post-launch support depending on the package.`
            },
            {
                triggers: ['seo', 'search engine', 'ranking'],
                response: `Yes, we offer SEO setup and optimization including:
- Technical SEO
- On-page optimization
- Site speed improvements
- Analytics + Search Console setup
- SEO-friendly content structure`
            },
            {
                triggers: ['technologies', 'tech stack', 'stack', 'tools'],
                response: `We use modern technologies based on project needs:
- Frontend: React, Next.js, HTML/CSS/JS
- Backend: Node.js, Express, API integrations
- Databases: MongoDB, PostgreSQL
- Deployment: Vercel and cloud platforms`
            },
            {
                triggers: ['payment', 'terms', 'installment'],
                response: `Standard payment terms:
- 50% upfront to start
- 30% on milestone approval
- 20% on final delivery

For larger projects, we can structure milestone-based plans.`
            },
            {
                triggers: ['similar', 'aksharjobs', 'axarevents', 'velora', 'leadora'],
                response: `Yes — we can build similar projects:
- Job platforms like AksharJobs
- Events platforms like AxarEvents
- Premium e-commerce like Velora
- AI lead automation tools like Leadora

Share your idea and required features, and we’ll propose architecture + timeline.`
            },
            {
                triggers: ['whatsapp', 'phone', 'call', 'contact number'],
                response: `You can reach us directly on WhatsApp at:
**+254 795 091 955**

You can also use the left WhatsApp button on this page.`
            },
            {
                triggers: ['hosting', 'domain', 'server'],
                response: `Yes, we assist with hosting and domain setup:
- New hosting/domain setup
- Migration from old providers
- SSL and DNS configuration
- Ongoing uptime/performance monitoring`
            }
        ];
    }

    getHardcodedResponse(message) {
        const normalized = message.toLowerCase();

        for (const pair of this.qaPairs) {
            if (pair.triggers.some(trigger => normalized.includes(trigger))) {
                return pair.response;
            }
        }

        return `Great question. I can help with pricing, timelines, process, features, maintenance, and project planning.

Quick options you can ask:
- "How much does a website cost?"
- "How long will my project take?"
- "What is your development process?"
- "Can you build something like AksharJobs/AxarEvents/Velora/Leadora?"
- "What is your WhatsApp number?"

For direct chat, WhatsApp: **+254 795 091 955**.`;
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
            // Simulate assistant thinking delay for natural UX
            await new Promise(resolve => setTimeout(resolve, 500));
            const botResponse = this.getHardcodedResponse(message);

            this.hideTyping();
            this.addMessage(botResponse, false);

            this.conversationHistory.push({
                role: 'assistant',
                content: botResponse
            });

            // Keep conversation history manageable (last 10 messages)
            if (this.conversationHistory.length > 20) {
                this.conversationHistory = this.conversationHistory.slice(-20);
            }

        } catch (error) {
            console.error('Chatbot error:', error);
            this.hideTyping();
            this.addMessage('Sorry, I encountered an error. Please try again in a moment.', false);
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

