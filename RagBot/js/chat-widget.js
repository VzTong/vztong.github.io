/**
 * Chat Widget JavaScript
 * Tương tác với RAGBot API và xử lý giao diện chat widget
 */

class ChatWidget {
    constructor() {
        this.isOpen = false;
        // API URL for Python server - có thể thay đổi theo môi trường
        this.apiUrl = 'http://170.64.160.231:5000/api/chat'; // External API
        // this.apiUrl = '/api/chat'; // Local Flask API - uncomment để test local
        this.messages = [];
        this.useRealAPI = true; // Set false để dùng mock responses

        // Performance optimizations
        this.messageCache = new Map(); // Cache for responses
        this.isTyping = false;
        this.lastMessageTime = 0;
        this.minResponseTime = 500; // Minimum response time for UX

        // Debounce settings
        this.debounceTimeout = null;
        this.debounceDelay = 300;

        this.init();
    }

    init() {
        this.createWidget();
        this.bindEvents();
        this.showWelcomeMessage();
        this.handleResize();
    }

    // Handle responsive behavior
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
                    <i class="fa-solid fa-robot"></i>
                </button>
                <div class="chat-widget-container" id="chatWidgetContainer">
                    <div class="chat-widget-header">
                        <div class="header-info">
                            <div class="avatar">
                                <i class="fas fa-robot"></i>
                            </div>
                            <div class="header-text">
                                <h4>RAGBot Assistant</h4>
                                <p id="widgetStatus">Online • Sẵn sàng hỗ trợ</p>
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
                            <h4>Xin chào! 👋</h4>
                            <p>Tôi là RAGBot, trợ lý AI của bạn. Hãy hỏi tôi bất cứ điều gì bạn muốn biết!</p>
                        </div>
                    </div>
                    <div class="chat-widget-input-area">
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

        toggleBtn.addEventListener('click', () => this.toggleWidget());
        closeBtn.addEventListener('click', () => this.closeWidget());
        form.addEventListener('submit', (e) => this.handleSubmit(e));

        // Auto-resize textarea
        input.addEventListener('input', () => this.autoResizeTextarea(input));

        // Enter to send (Shift+Enter for new line)
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleSubmit(e);
            }
        });

        // Prevent widget from closing when clicking inside
        document.getElementById('chatWidgetContainer').addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    toggleWidget() {
        const container = document.getElementById('chatWidgetContainer');
        const button = document.getElementById('chatWidgetToggle');

        if (this.isOpen) {
            this.closeWidget();
        } else {
            this.openWidget();
        }
    }

    openWidget() {
        const container = document.getElementById('chatWidgetContainer');
        const button = document.getElementById('chatWidgetToggle');
        const widget = document.querySelector('.chat-widget');

        container.style.display = 'flex';
        // Trigger reflow để animation hoạt động
        container.offsetHeight;
        container.classList.add('show');

        // Ẩn button khi widget mở để tăng không gian
        widget.classList.add('widget-open');

        button.innerHTML = '<i class="fas fa-chevron-down"></i>';
        this.isOpen = true;

        // Mobile specific handling
        if (window.innerWidth <= 768) {
            document.body.classList.add('chat-widget-open');
            // Prevent scroll on mobile
            document.body.style.overflow = 'hidden';
        }

        // Remove notification badge
        this.removeNotificationBadge();

        // Update status
        this.updateStatus('Online • Đang trò chuyện');

        // Focus input
        setTimeout(() => {
            const input = document.getElementById('chatWidgetInput');
            if (input && window.innerWidth > 768) {
                // Only focus on desktop to avoid mobile keyboard issues
                input.focus();
            }
        }, 300);
    }

    closeWidget() {
        const container = document.getElementById('chatWidgetContainer');
        const button = document.getElementById('chatWidgetToggle');
        const widget = document.querySelector('.chat-widget');

        container.classList.remove('show');

        // Hiện lại button khi widget đóng
        widget.classList.remove('widget-open');

        // Mobile specific handling
        if (window.innerWidth <= 768) {
            document.body.classList.remove('chat-widget-open');
            // Restore scroll on mobile
            document.body.style.overflow = '';
        }

        setTimeout(() => {
            container.style.display = 'none';
        }, 400);

        button.innerHTML = '<i class="fas fa-comments"></i>';
        this.isOpen = false;

        // Update status
        this.updateStatus('Offline');
    }

    updateStatus(status) {
        const statusElement = document.getElementById('widgetStatus');
        if (statusElement) {
            statusElement.textContent = status;
        }
    }

    autoResizeTextarea(textarea) {
        textarea.style.height = 'auto';
        const maxHeight = window.innerWidth <= 768 ? 60 : 80; // Smaller max height on mobile
        textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + 'px';
    }

    handleSubmit(e) {
        e.preventDefault();

        const input = document.getElementById('chatWidgetInput');
        const message = input.value.trim();

        if (!message) return;

        // Performance optimization: Clear input immediately
        input.value = '';
        input.style.height = 'auto';

        // Add user message với thời gian
        this.addMessage(message, 'user');

        // Update status immediately for better UX
        this.updateStatus('Đang suy nghĩ...');

        // Send message to API server with immediate response
        this.sendToAPI(message);
    }

    // Add notification badge to widget button
    addNotificationBadge() {
        const button = document.getElementById('chatWidgetToggle');
        if (button && !this.isOpen) {
            button.classList.add('has-notification');
        }
    }

    removeNotificationBadge() {
        const button = document.getElementById('chatWidgetToggle');
        if (button) {
            button.classList.remove('has-notification');
        }
    }

    // Enhanced message handling with caching
    addMessage(content, sender, timestamp = null) {
        const messagesContainer = document.getElementById('chatWidgetMessages');
        const welcomeMessage = messagesContainer.querySelector('.welcome-message');

        // Remove welcome message on first user message
        if (sender === 'user' && welcomeMessage) {
            welcomeMessage.remove();
        }

        const time = timestamp || this.formatTime(new Date());
        const messageElement = document.createElement('div');
        messageElement.className = `widget-message ${sender}`;

        // Use DocumentFragment for better performance
        const fragment = document.createDocumentFragment();
        messageElement.innerHTML = `
            <div class="widget-message-bubble">
                ${this.formatMessage(content)}
            </div>
            <div class="widget-message-time">${time}</div>
        `;

        fragment.appendChild(messageElement);
        messagesContainer.appendChild(fragment);

        // Optimized scroll to bottom
        this.scrollToBottomSmooth();

        // Store message
        this.messages.push({
            content,
            sender,
            timestamp: new Date().toISOString()
        });

        // Add notification for bot messages when widget is closed
        if (sender === 'bot' && !this.isOpen) {
            this.addNotificationBadge();
        }
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chatWidgetMessages');
        const typingElement = document.createElement('div');
        typingElement.className = 'widget-message bot';
        typingElement.id = 'typingIndicator';

        typingElement.innerHTML = `
            <div class="typing-indicator">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;

        messagesContainer.appendChild(typingElement);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    simulateBotResponse(userMessage) {
        // Check if we should use real API or mock
        if (this.useRealAPI) {
            this.sendToAPI(userMessage);
        } else {
            // Simulate API delay for mock responses
            setTimeout(() => {
                this.hideTypingIndicator();

                // Mock responses for testing
                const mockResponses = [
                    "Cảm ơn bạn đã sử dụng RAGBot! Tôi đang được phát triển để hỗ trợ bạn tốt hơn.",
                    "Đây là phiên bản demo của widget chat. API sẽ được tích hợp sau.",
                    "Tôi hiểu bạn muốn hỏi về: " + userMessage + ". Chức năng này đang được phát triển.",
                    "RAGBot sẽ sớm có thể trả lời các câu hỏi phức tạp của bạn!",
                    "Cảm ơn bạn đã kiên nhẫn trong quá trình phát triển. 🚀"
                ];

                const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
                this.addMessage(randomResponse, 'bot');

                // Update status back to normal
                this.updateStatus('Online • Sẵn sàng hỗ trợ');
            }, 1000 + Math.random() * 2000);
        }
    }

    // Real API integration - Optimized for better performance
    async sendToAPI(message) {
        try {
            // Check cache first
            const cachedResponse = this.getCachedResponse(message);
            if (cachedResponse) {
                this.hideTypingIndicator();
                setTimeout(() => {
                    this.addMessage(cachedResponse, 'bot');
                    this.updateStatus('Online • Sẵn sàng hỗ trợ');
                }, 300);
                return;
            }

            // Performance optimization: track response time
            const startTime = Date.now();

            // Reduced timeout for faster response
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

            // Performance optimization: start typing indicator immediately
            this.showTypingIndicator();

            // Use fetch with optimized headers
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Cache-Control': 'no-cache'
                },
                body: JSON.stringify({
                    message: message,
                    timestamp: Date.now() // Add timestamp for caching
                }),
                signal: controller.signal,
                // Performance optimization
                keepalive: true,
                priority: 'high'
            });

            clearTimeout(timeoutId);
            const responseTime = Date.now() - startTime;

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            // Handle response based on your API format
            const botResponse = data.reply || data.response || 'Xin lỗi, tôi không thể trả lời câu hỏi này.';

            // Cache the response
            this.setCachedResponse(message, botResponse);

            // Ensure minimum response time for better UX
            const remainingTime = Math.max(0, this.minResponseTime - responseTime);

            setTimeout(() => {
                this.hideTypingIndicator();
                this.addMessage(botResponse, 'bot');
                this.updateStatus('Online • Sẵn sàng hỗ trợ');
            }, remainingTime);

        } catch (error) {
            console.error('API Error:', error);
            this.handleError(error, message);
        }
    }

    // Enhanced error handling - Updated for better error messages
    handleError(error, userMessage = null) {
        console.error('Chat Widget Error:', error);

        this.hideTypingIndicator();

        let errorMessage = 'Xin lỗi, đã có lỗi xảy ra. ';

        if (error.name === 'AbortError') {
            errorMessage = 'Yêu cầu quá lâu, vui lòng thử lại.';
            this.updateStatus('Timeout');
        } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối internet và thử lại.';
            this.updateStatus('Lỗi kết nối');
        } else if (error.message.includes('500')) {
            errorMessage = 'Server đang gặp sự cố. Vui lòng thử lại sau vài phút.';
            this.updateStatus('Lỗi server');
        } else if (error.message.includes('404')) {
            errorMessage = 'Không tìm thấy API endpoint. Vui lòng liên hệ hỗ trợ.';
            this.updateStatus('API không tìm thấy');
        } else if (error.message.includes('429')) {
            errorMessage = 'Bạn đã gửi quá nhiều tin nhắn. Vui lòng chờ một chút rồi thử lại.';
            this.updateStatus('Giới hạn tin nhắn');
        } else {
            errorMessage += 'Vui lòng thử lại sau. Chi tiết lỗi: ' + error.message;
            this.updateStatus('Lỗi không xác định');
        }

        this.addMessage(errorMessage, 'bot');

        // Auto-reset status after error
        setTimeout(() => {
            this.updateStatus('Online • Sẵn sàng hỗ trợ');
        }, 10000);
    }

    // Utility function to check if widget is working
    testWidget() {
        console.log('Testing chat widget functionality...');
        console.log('Widget state:', {
            isOpen: this.isOpen,
            messagesCount: this.messages.length,
            apiUrl: this.apiUrl,
            useRealAPI: this.useRealAPI
        });

        // Test message
        this.addMessage('Widget test successful! 🎉', 'bot');
        return true;
    }

    // Method to switch API endpoints
    setApiUrl(url) {
        this.apiUrl = url;
        console.log('API URL updated to:', this.apiUrl);
        this.updateStatus('API cập nhật: ' + (url.includes('localhost') ? 'Local' : 'Remote'));
        setTimeout(() => {
            this.updateStatus('Online • Sẵn sàng hỗ trợ');
        }, 3000);
    }

    // Method to test API connectivity
    async testApiConnection() {
        try {
            this.updateStatus('Đang kiểm tra kết nối...');
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: 'test connection' })
            });

            if (response.ok) {
                this.updateStatus('✅ Kết nối API thành công');
                this.addMessage('Kết nối API thành công! 🎉', 'bot');
                return true;
            } else {
                throw new Error(`HTTP ${response.status}`);
            }
        } catch (error) {
            this.updateStatus('❌ Lỗi kết nối API');
            this.addMessage('Không thể kết nối đến API: ' + error.message, 'bot');
            return false;
        } finally {
            setTimeout(() => {
                this.updateStatus('Online • Sẵn sàng hỗ trợ');
            }, 5000);
        }
    }

    // Preload API connection for better performance
    async preloadAPI() {
        try {
            // Warm up the connection
            await fetch(this.apiUrl, {
                method: 'OPTIONS',
                mode: 'cors'
            }).catch(() => {
                // Ignore errors for preflight requests
            });

            console.log('API connection preloaded');
        } catch (error) {
            console.log('API preload failed:', error);
        }
    }

    formatMessage(content) {
        // Basic text formatting
        return content
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>');
    }

    formatTime(date) {
        return date.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Enhanced scroll function with smooth animation
    scrollToBottom() {
        const messagesContainer = document.getElementById('chatWidgetMessages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    scrollToBottomSmooth() {
        const messagesContainer = document.getElementById('chatWidgetMessages');
        messagesContainer.scrollTo({
            top: messagesContainer.scrollHeight,
            behavior: 'smooth'
        });
    }

    // Check if message is cached
    getCachedResponse(message) {
        const cacheKey = message.toLowerCase().trim();
        return this.messageCache.get(cacheKey);
    }

    // Cache response for future use
    setCachedResponse(message, response) {
        const cacheKey = message.toLowerCase().trim();
        this.messageCache.set(cacheKey, response);

        // Limit cache size to prevent memory issues
        if (this.messageCache.size > 100) {
            const firstKey = this.messageCache.keys().next().value;
            this.messageCache.delete(firstKey);
        }
    }

    // Debounced API call
    debouncedSendToAPI(message) {
        if (this.debounceTimeout) {
            clearTimeout(this.debounceTimeout);
        }

        this.debounceTimeout = setTimeout(() => {
            this.sendToAPI(message);
        }, this.debounceDelay);
    }

    showWelcomeMessage() {
        // Welcome message is already in HTML, no need to add programmatically
    }

    // Export chat history
    exportChatHistory() {
        return {
            messages: this.messages,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        };
    }

    // Import chat history
    importChatHistory(data) {
        this.messages = data.messages || [];
        const messagesContainer = document.getElementById('chatWidgetMessages');
        messagesContainer.innerHTML = '';

        if (this.messages.length === 0) {
            this.showWelcomeMessage();
        } else {
            this.messages.forEach(msg => {
                this.addMessage(msg.content, msg.sender, this.formatTime(new Date(msg.timestamp)));
            });
        }
    }
}

// Initialize chat widget when DOM is loaded with performance optimization
document.addEventListener('DOMContentLoaded', function() {
    // Performance optimization: Load widget asynchronously
    const loadWidget = () => {
        // Check if Font Awesome is loaded, if not load it
        if (!document.querySelector('link[href*="font-awesome"]')) {
            const fontAwesome = document.createElement('link');
            fontAwesome.rel = 'stylesheet';
            fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
            fontAwesome.crossOrigin = 'anonymous';
            document.head.appendChild(fontAwesome);
        }

        // Initialize widget after a short delay to ensure all resources are loaded
        setTimeout(() => {
            window.chatWidget = new ChatWidget();

            // Preload API connection
            if (window.chatWidget.useRealAPI) {
                window.chatWidget.preloadAPI();
            }
        }, 100);
    };

    // Use requestIdleCallback for better performance
    if (window.requestIdleCallback) {
        requestIdleCallback(loadWidget);
    } else {
        setTimeout(loadWidget, 100);
    }
});

// Global functions for external control
window.toggleChatWidget = function() {
    if (window.chatWidget) {
        window.chatWidget.toggleWidget();
    }
};

window.sendMessageToWidget = function(message) {
    if (window.chatWidget) {
        window.chatWidget.addMessage(message, 'bot');
    }
};

// Additional global functions for testing and control
window.testChatWidget = function() {
    if (window.chatWidget) {
        return window.chatWidget.testWidget();
    }
    console.log('Chat widget not loaded');
    return false;
};

window.testApiConnection = function() {
    if (window.chatWidget) {
        return window.chatWidget.testApiConnection();
    }
    console.log('Chat widget not loaded');
    return false;
};

window.setApiUrl = function(url) {
    if (window.chatWidget) {
        window.chatWidget.setApiUrl(url);
        console.log('API URL set to:', url);
    } else {
        console.log('Chat widget not loaded');
    }
};

window.useLocalApi = function() {
    window.setApiUrl('/api/chat');
};

window.useRemoteApi = function() {
    window.setApiUrl('http://170.64.160.231:5000/api/chat');
};

window.openChatWidget = function() {
    if (window.chatWidget && !window.chatWidget.isOpen) {
        window.chatWidget.openWidget();
    }
};

window.closeChatWidget = function() {
    if (window.chatWidget && window.chatWidget.isOpen) {
        window.chatWidget.closeWidget();
    }
};

window.minimizeChatWidget = function() {
    console.log('Minimize function removed - widget now only supports open/close');
};

// Debug function
window.getChatWidgetStatus = function() {
    if (window.chatWidget) {
        return {
            isLoaded: true,
            isOpen: window.chatWidget.isOpen,
            messagesCount: window.chatWidget.messages.length,
            apiUrl: window.chatWidget.apiUrl,
            useRealAPI: window.chatWidget.useRealAPI
        };
    }
    return { isLoaded: false };
};

// Console info for developers
console.log('🤖 RAGBot Chat Widget loaded!');
console.log('Available functions:');
console.log('- toggleChatWidget() - Toggle widget open/close');
console.log('- openChatWidget() - Open widget');
console.log('- closeChatWidget() - Close widget');
console.log('- testChatWidget() - Test widget functionality');
console.log('- testApiConnection() - Test API connectivity');
console.log('- setApiUrl(url) - Set custom API URL');
console.log('- useLocalApi() - Switch to local API (/api/chat)');
console.log('- useRemoteApi() - Switch to remote API');
console.log('- sendMessageToWidget(message) - Send a message to widget');
console.log('- getChatWidgetStatus() - Get widget status');
console.log('- getWidgetPerformance() - Get performance metrics');

// Performance monitoring
window.getWidgetPerformance = function() {
    if (window.chatWidget) {
        return {
            cacheSize: window.chatWidget.messageCache.size,
            messagesCount: window.chatWidget.messages.length,
            isTyping: window.chatWidget.isTyping,
            lastMessageTime: window.chatWidget.lastMessageTime,
            apiUrl: window.chatWidget.apiUrl,
            memoryUsage: performance.memory ? {
                usedJSHeapSize: performance.memory.usedJSHeapSize,
                totalJSHeapSize: performance.memory.totalJSHeapSize,
                jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
            } : 'Not available'
        };
    }
    return { error: 'Widget not loaded' };
};

// Clear cache function
window.clearWidgetCache = function() {
    if (window.chatWidget) {
        window.chatWidget.messageCache.clear();
        console.log('Widget cache cleared');
        return true;
    }
    return false;
};
