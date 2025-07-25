// Chat Widget - Static JS version, no backend required
class ChatWidget {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.chatbotData = null;
        this.lang = 'vi';
        this.init();
        this.loadChatbotData();
    }

    loadChatbotData() {
        fetch('js/chatbot-data.json')
            .then(res => res.json())
            .then(data => {
                this.chatbotData = data;
            });
    }

    init() {
        this.createWidget();
        this.bindEvents();
        this.showWelcomeMessage();
        this.handleResize();
    }

    handleResize() {
        const handleResize = () => {
            if (this.isOpen && window.innerWidth <= 768) {
                document.body.classList.add('chat-widget-open');
                document.body.style.overflow = 'hidden';
            } else {
                document.body.classList.remove('chat-widget-open');
                document.body.style.overflow = '';
            }
        };
        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', () => {
            setTimeout(handleResize, 100);
        });
    }

    createWidget() {
        const widgetHTML = `
            <div class="chat-widget">
                <button class="chat-widget-button" id="chatWidgetToggle">
                    <i class="fas fa-robot"></i>
                </button>
                <div class="chat-widget-container" id="chatWidgetContainer">
                    <div class="chat-widget-header">
                        <div class="header-info">
                            <div class="avatar">
                                <i class="fas fa-robot"></i>
                            </div>
                            <div class="header-text">
                                <h4>AI Assistant</h4>
                                <p id="widgetStatus"><span class="status-indicator"></span>Online • Sẵn sàng hỗ trợ</p>
                            </div>
                        </div>
                        <div class="chat-widget-controls">
                            <button class="chat-widget-close" id="chatWidgetClose" title="Đóng">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                    <div class="chat-widget-messages" id="chatWidgetMessages">
                        <div class="welcome-message">
                            <i class="fas fa-robot"></i>
                            <h4>Xin chào! 👋 / Hello! 👋</h4>
                            <p>Tôi là AI Assistant, trợ lý thông minh của bạn. Hãy hỏi tôi bất cứ điều gì bạn muốn biết!</p>
                            <p><em>I'm your AI Assistant! Ask me anything you want to know!</em></p>
                        </div>
                    </div>
                    <div class="chat-widget-input-area">
                        <div id="quickQuestionsInput" style="gap: 10px; display: flex;">
                            <div style="display: flex;">
                                <button class="quick-question-btn btn-cv" data-vi="Giới thiệu về Vy" data-en="About Vy"><i class="fas fa-user"></i><span>Giới thiệu / About</span></button>
                                <button class="quick-question-btn btn-cv" data-vi="Kỹ năng của Vy" data-en="Vy skills"><i class="fas fa-lightbulb"></i><span>Kỹ năng / Skills</span></button>
                                <button class="quick-question-btn btn-cv" data-vi="Các dự án của Vy" data-en="Vy projects"><i class="fas fa-tasks"></i><span>Dự án / Projects</span></button>
                                <button class="quick-question-btn btn-cv" data-vi="Kinh nghiệm của Vy" data-en="Vy experience"><i class="fas fa-briefcase"></i><span>Kinh nghiệm / Experience</span></button>
                                <button class="quick-question-btn btn-cv" data-vi="Học vấn của Vy" data-en="Vy education"><i class="fas fa-graduation-cap"></i><span>Học vấn / Education</span></button>
                                <button class="quick-question-btn btn-cv" data-vi="Liên hệ với Vy" data-en="Contact Vy"><i class="fas fa-envelope"></i><span>Liên hệ / Contact</span></button>
                            </div>
                        </div>
                        <form class="chat-widget-form" id="chatWidgetForm">
                            <textarea
                                class="chat-widget-input"
                                id="chatWidgetInput"
                                placeholder="Nhập tin nhắn của bạn..."
                                rows="1"
                            ></textarea>
                            <button type="submit" class="chat-widget-send-btn" id="chatWidgetSend" title="Gửi tin nhắn">
                                <i class="fas fa-paper-plane"></i>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', widgetHTML);
    }

    bindEvents() {
        const toggleBtn = document.getElementById('chatWidgetToggle');
        const closeBtn = document.getElementById('chatWidgetClose');
        const form = document.getElementById('chatWidgetForm');
        const input = document.getElementById('chatWidgetInput');
        // Gắn sự kiện cho các nút trong widget
        toggleBtn.addEventListener('click', () => this.toggleWidget());
        closeBtn.addEventListener('click', () => this.closeWidget());
        form.addEventListener('submit', (e) => this.handleSubmit(e));
        input.addEventListener('input', () => this.autoResizeTextarea(input));
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleSubmit(e);
            }
        });
        document.getElementById('chatWidgetContainer').addEventListener('click', (e) => {
            e.stopPropagation();
        });
        // Gắn sự kiện cho các nút quick questions luôn hiển thị phía trên form nhập
        const quickBtns = document.querySelectorAll('#quickQuestionsInput .quick-question-btn');
        quickBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const msg = this.lang === 'vi' ? btn.getAttribute('data-vi') : btn.getAttribute('data-en');
                const input = document.getElementById('chatWidgetInput');
                input.value = msg;
                this.handleSubmit({ preventDefault: () => {} });
            });
        });
    }

    toggleWidget() {
        if (this.isOpen) {
            this.closeWidget();
        } else {
            this.openWidget();
        }
    }

    openWidget() {
        const container = document.getElementById('chatWidgetContainer');
        const widget = document.querySelector('.chat-widget');
        container.style.display = 'flex';
        container.offsetHeight;
        container.classList.add('show');
        widget.classList.add('widget-open');
        this.isOpen = true;
        if (window.innerWidth <= 768) {
            document.body.classList.add('chat-widget-open');
            document.body.style.overflow = 'hidden';
        }
        this.removeNotificationBadge();
        this.updateStatus('<span class="status-indicator"></span>Online • Đang trò chuyện');
        setTimeout(() => {
            const input = document.getElementById('chatWidgetInput');
            if (input && window.innerWidth > 768) input.focus();
        }, 300);
    }

    closeWidget() {
        const container = document.getElementById('chatWidgetContainer');
        const widget = document.querySelector('.chat-widget');
        container.classList.remove('show');
        widget.classList.remove('widget-open');
        if (window.innerWidth <= 768) {
            document.body.classList.remove('chat-widget-open');
            document.body.style.overflow = '';
        }
        setTimeout(() => {
            container.style.display = 'none';
        }, 400);
        this.isOpen = false;
        this.updateStatus('<span class="status-indicator"></span>Offline');
    }

    updateStatus(status) {
        const statusElement = document.getElementById('widgetStatus');
        if (statusElement) statusElement.innerHTML = status;
    }

    autoResizeTextarea(textarea) {
        textarea.style.height = 'auto';
        const maxHeight = window.innerWidth <= 768 ? 60 : 80;
        textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + 'px';
    }

    handleSubmit(e) {
        e.preventDefault();
        const input = document.getElementById('chatWidgetInput');
        const message = input.value.trim();
        if (!message) return;
        input.value = '';
        input.style.height = 'auto';
        this.addMessage(message, 'user');
        this.updateStatus('<span class="status-indicator"></span>Đang suy nghĩ...');
        this.handleStaticChat(message);
    }

    addMessage(content, sender, timestamp = null) {
        const messagesContainer = document.getElementById('chatWidgetMessages');
        if (!this.messages) this.messages = [];
        const welcomeMessage = messagesContainer.querySelector('.welcome-message');
        if (sender === 'user' && welcomeMessage) welcomeMessage.remove();
        const time = timestamp || this.formatTime(new Date());
        const messageElement = document.createElement('div');
        messageElement.className = `widget-message ${sender}`;
        messageElement.innerHTML = `
            <div class="widget-message-bubble">
                ${this.formatMessage(content)}
            </div>
            <div class="widget-message-time">${time}</div>
        `;
        messagesContainer.appendChild(messageElement);
        this.scrollToBottomSmooth();
        this.messages.push({
            content,
            sender,
            timestamp: new Date().toISOString()
        });
        if (sender === 'bot' && !this.isOpen) {
            this.addNotificationBadge();
        }
    }

    formatMessage(content) {
        return content.replace(/\n/g, '<br>');
    }

    formatTime(date) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    scrollToBottomSmooth() {
        const messagesContainer = document.getElementById('chatWidgetMessages');
        messagesContainer.scrollTo({ top: messagesContainer.scrollHeight, behavior: 'smooth' });
    }

    addNotificationBadge() {
        const button = document.getElementById('chatWidgetToggle');
        if (button && !this.isOpen) button.classList.add('has-notification');
    }

    removeNotificationBadge() {
        const button = document.getElementById('chatWidgetToggle');
        if (button) button.classList.remove('has-notification');
    }

    showWelcomeMessage() {
        // Hiện quick questions nếu đã từng hỏi
        if (document.getElementById('quickQuestions')) {
            document.getElementById('quickQuestions').style.display = '';
        }
    }

    handleStaticChat(message) {
        if (!this.chatbotData) {
            this.addMessage('Đang tải dữ liệu...', 'bot');
            return;
        }
        const msg = message.toLowerCase();
        if (msg.includes('english') || msg.includes('tiếng anh')) {
            this.lang = 'en';
            this.addMessage('Switched to English 🇺🇸', 'bot');
            return;
        }
        if (msg.includes('vietnamese') || msg.includes('tiếng việt')) {
            this.lang = 'vi';
            this.addMessage('Đã chuyển sang tiếng Việt 🇻🇳', 'bot');
            return;
        }
        let reply = '';
        if (msg.includes('chào') || msg.includes('hello') || msg.includes('hi')) {
            reply = this.chatbotData.greeting[this.lang];
        } else if (msg.includes('giới thiệu') || msg.includes('about') || msg.includes('về bạn') || msg.includes('who is')) {
            reply = this.chatbotData.about[this.lang];
        } else if (msg.includes('dự án') || msg.includes('project') || msg.includes('portfolio')) {
            reply = this.chatbotData.projects[this.lang];
        } else if (msg.includes('kỹ năng') || msg.includes('skill') || msg.includes('công nghệ') || msg.includes('technology')) {
            reply = this.chatbotData.skills[this.lang];
        } else if (msg.includes('liên hệ') || msg.includes('contact') || msg.includes('email')) {
            reply = this.chatbotData.contact[this.lang];
        } else if (msg.includes('kinh nghiệm') || msg.includes('experience') || msg.includes('làm việc') || msg.includes('work')) {
            reply = this.chatbotData.experience[this.lang];
        } else if (msg.includes('học vấn') || msg.includes('education') || msg.includes('trường') || msg.includes('university')) {
            reply = this.chatbotData.education[this.lang];
        } else {
            reply = this.lang === 'vi'
                ? 'Bạn có thể hỏi về: Giới thiệu, Kỹ năng, Dự án, Kinh nghiệm, Học vấn, Liên hệ của Vy nhé!'
                : 'You can ask about: About, Skills, Projects, Experience, Education, or Contact Vy!';
        }
        this.addMessage(reply, 'bot');
    }
}

// Khởi tạo widget khi trang đã load
window.addEventListener('DOMContentLoaded', () => {
    new ChatWidget();
});
