// Chat Widget - Static JS version, no backend required
class ChatWidget {
    constructor() {
        try {
            this.isOpen = false;
            this.messages = [];
            this.chatbotData = null;
            this.lang = this.getCurrentLanguage();
            this.init();
            this.loadChatbotData();
            this.bindLanguageEvents();
        } catch (error) {
            console.error('Chat widget constructor error:', error);
            // Use fallback data immediately if constructor fails
            this.useFallbackData();
        }
    }

    // Lấy ngôn ngữ hiện tại từ localStorage (được set bởi language-switcher)
    getCurrentLanguage() {
        const storedLang = localStorage.getItem('language') || 'us';
        return storedLang === 'us' ? 'us' : 'vn'; // Map 'vi' to 'vn' for consistency
    }

    // Lắng nghe sự thay đổi ngôn ngữ từ language switcher
    bindLanguageEvents() {
        // Listen for storage changes (khi language switcher thay đổi localStorage)
        window.addEventListener('storage', (e) => {
            if (e.key === 'language') {
                this.updateLanguage(e.newValue);
            }
        });

        // Cũng check định kỳ để đảm bảo đồng bộ
        setInterval(() => {
            const currentLang = this.getCurrentLanguage();
            if (currentLang !== this.lang) {
                this.updateLanguage(currentLang);
            }
        }, 1000);
    }

    // Cập nhật ngôn ngữ và refresh UI
    updateLanguage(newLang) {
        const mappedLang = newLang === 'us' ? 'us' : 'vn';
        if (mappedLang !== this.lang) {
            this.lang = mappedLang;
            this.updateChatUI();
        }
    }

    loadChatbotData() {
        // Try multiple paths for hosting compatibility
        const possiblePaths = [
            'js/chatbot-data.json',
            './js/chatbot-data.json',
            '/js/chatbot-data.json',
            '../js/chatbot-data.json'
        ];

        const tryLoadData = (pathIndex = 0) => {
            if (pathIndex >= possiblePaths.length) {
                console.error('Could not load chatbot data from any path');
                this.useFallbackData();
                return;
            }

            fetch(possiblePaths[pathIndex])
                .then(res => {
                    if (!res.ok) throw new Error(`HTTP ${res.status}`);
                    return res.json();
                })
                .then(data => {
                    this.chatbotData = data;
                    console.log('Chatbot data loaded successfully from:', possiblePaths[pathIndex]);
                })
                .catch(err => {
                    console.warn(`Failed to load from ${possiblePaths[pathIndex]}:`, err);
                    tryLoadData(pathIndex + 1);
                });
        };

        tryLoadData();
    }

    useFallbackData() {
        // Fallback data embedded directly in the script
        this.chatbotData = {
            "greeting": {
                "vn": "Xin chào! 👋 Mình là AI bạn thân của Vy đây!\n\nBạn muốn biết gì về Vy không? Hỏi về kỹ năng, dự án, kinh nghiệm, học vấn, liên hệ... gì cũng được nhé! 😄\n\nMuốn biết chi tiết hơn thì lượn một vòng trang web này nha! 🚀",
                "us": "Hello there! 👋 I'm Vy's AI bestie!\n\nWhat do you wanna know about Vy? Ask about skills, projects, experience, education, contact... anything goes! 😄\n\nFor more juicy details, take a stroll around this website! 🚀"
            },
            "about": {
                "vn": "👩‍💻 Vy là người vừa mê code vừa nghiện du lịch!\n\nBan ngày code, ban đêm debug, còn xen giữa thì mơ mộng những chuyến đi chơi! 😆 Sinh viên CNTT đam mê .NET, C#, backend, thích khám phá công nghệ mới và... cả thế giới nữa!\n\nSlogan sống: 'Hãy tận hưởng tự do và luôn tiến bước trong hành trình học tập.' ✨\n\nMuốn biết thêm về hành trình 'lập trình viên lang thang' của Vy? Lướt tiếp trang web này nhé! 🎒",
                "us": "👩‍💻 Vy is someone who loves coding AND wandering!\n\nCode by day, debug by night, dreaming of getaways in between! 😆 IT student passionate about .NET, C#, backend, loves exploring new tech and... the world too!\n\nLife motto: 'Enjoy the freedom, keep learning forward.' ✨\n\nWanna know more about Vy's 'wandering programmer' journey? Keep scrolling this website! 🎒"
            },
            "projects": {
                "vn": "🎬 Dự án 'chất lượng' của Vy: website xem phim (để cày phim lúc rảnh), game Flappy Bird cực 'cay cú' 😤, hệ thống đặt phòng khách sạn (để book chỗ đi chơi)...\n\nMỗi dự án đều mang đậm 'chất Vy' - vừa thực tế vừa vui! 🎯\n\nMuốn xem chi tiết từng dự án? Ghé mục Portfolio trên trang web này nhé! Có hình đẹp đấy! 😎📸",
                "us": "🎬 Vy's 'quality' projects: movie website (for binge-watching during free time), super 'frustrating' Flappy Bird game 😤, hotel booking system (to book places for adventures)...\n\nEach project has that 'Vy touch' - practical yet fun! 🎯\n\nWanna see project details? Check out the Portfolio section on this website! There are pretty pictures! 😎📸"
            },
            "skills": {
                "vn": "💡 Kỹ năng 'độc đáo' của Vy: C#, .NET, SQL, Git, Postman, Python, VueJs... và khả năng debug đến 3h sáng mà vẫn \"tỉnh\"! 😴\n\nLuôn ham học hỏi công nghệ mới mỗi ngày - từ backend đến frontend, từ code đến... coffee! ☕\n\nMuốn xem kỹ năng chi tiết? Lướt tiếp trang web này để khám phá thêm nhé! 🔍",
                "us": "💡 Vy's 'unique' skills: C#, .NET, SQL, Git, Postman, Python, VueJs... and the ability to debug until 3 AM and still be \"awake\"! 😴\n\nAlways eager to learn new tech daily - from backend to frontend, from code to... coffee! ☕\n\nWant detailed skills? Keep browsing this website to discover more! 🔍"
            },
            "contact": {
                "vn": "📧 Email: vzz95559@gmail.com (reply nhanh như chớp! ⚡)\n📱 Điện thoại: 0848 735 559 (có thể gọi để hỏi về code hoặc... địa điểm du lịch đẹp! 😊)\n🌏 Kiên Giang, Việt Nam (quê hương tôm cá! 🦐)\n\nMạng xã hội: Facebook, LinkedIn, GitHub - follow để cập nhật hành trình coding & traveling của Vy! 📱\n\nMuốn kết nối hoặc hợp tác? Đừng ngại liên hệ nhé! Info chi tiết ở cuối trang web này! 🤝",
                "us": "📧 Email: vzz95559@gmail.com (lightning-fast replies! ⚡)\n📱 Phone: 0848 735 559 (you can call about coding or... beautiful travel spots! 😊)\n🌏 Kien Giang, Vietnam (shrimp and fish hometown! 🦐)\n\nSocials: Facebook, LinkedIn, GitHub - follow to keep up with Vy's coding & traveling adventures! 📱\n\nWanna connect or collaborate? Don't hesitate to reach out! Detailed info at the bottom of this website! 🤝"
            },
            "experience": {
                "vn": "🧑‍💻 Kinh nghiệm 'thực chiến': Thực tập sinh .NET Backend tại 365 EJSC - nơi mình học được cách 'chiến đấu' với bugs và... deadline! 😅\n\nLàm dự án thực tế, phát triển API, teamwork cực vui (và đôi khi căng thẳng), áp dụng Clean Architecture, CQRS... nghe fancy nhưng thực ra là để code 'sạch sẽ' hơn thôi! 🧹\n\nCòn có mấy dự án cá nhân 'tự sướng' về web, game, quản lý dữ liệu nữa!\n\nMuốn xem chi tiết? Ghé mục Resume trên trang web này nhé! 📄",
                "us": "🧑‍💻 'Real combat' experience: .NET Backend Intern at 365 EJSC - where I learned to 'fight' bugs and... deadlines! 😅\n\nWorked on real projects, developed APIs, super fun teamwork (and sometimes stressful), applied Clean Architecture, CQRS... sounds fancy but actually just to make code 'cleaner'! 🧹\n\nAlso got some 'self-indulgent' personal projects in web, games, data management!\n\nWanna see details? Check out the Resume section on this website! 📄"
            },
            "education": {
                "vn": "🎓 Học vấn: Đại học Nam Cần Thơ, ngành CNTT - nơi mình 'lăn lộn' với code và... assignments không ngừng! 📚\n\nThích lập trình, công nghệ web, và cả những buổi thảo luận 'nảy lửa' với bạn bè về tech mới! 💬\n\nHọc đại học không chỉ là absorb kiến thức mà còn là kết nối với cộng đồng tech lovers! 🤝\n\nMuốn biết thêm về cuộc sống sinh viên IT? Xem thêm ở mục About trên trang web này! 🎒",
                "us": "🎓 Education: Nam Can Tho University, IT major - where I 'wrestle' with code and... endless assignments! 📚\n\nLove programming, web tech, and those 'heated' discussions with friends about new tech! 💬\n\nUniversity isn't just about absorbing knowledge but also connecting with fellow tech lovers! 🤝\n\nWanna know more about IT student life? Check out the About section on this website! 🎒"
            }
        };
        console.log('Using fallback chatbot data');
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
                                <h4 id="chatAssistantTitle">AI Assistant</h4>
                                <p id="widgetStatus"><span class="status-indicator"></span><span id="chatOnlineStatus">${this.getOnlineText()}</span></p>
                            </div>
                        </div>
                        <div class="chat-widget-controls">
                            <button class="chat-widget-close" id="chatWidgetClose" title="${this.getCloseText()}">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                    <div class="chat-widget-messages" id="chatWidgetMessages">
                        <div class="welcome-message">
                            <i class="fas fa-robot"></i>
                            <h4 id="chatWelcomeTitle">${this.getWelcomeTitle()}</h4>
                            <p id="chatWelcomeText1">${this.getWelcomeText1()}</p>
                        </div>
                    </div>
                    <div class="chat-widget-input-area">
                        <div id="quickQuestionsInput" class="quick-questions-container">
                            <div class="quick-buttons-row">
                                <button class="quick-question-btn btn-cv" data-vi="Giới thiệu về Vy" data-en="About Vy">
                                    <i class="fas fa-user"></i>
                                    <span id="quickBtn1">${this.getQuickBtnText(1)}</span>
                                </button>
                                <button class="quick-question-btn btn-cv" data-vi="Kỹ năng của Vy" data-en="Vy skills">
                                    <i class="fas fa-lightbulb"></i>
                                    <span id="quickBtn2">${this.getQuickBtnText(2)}</span>
                                </button>
                                <button class="quick-question-btn btn-cv" data-vi="Các dự án của Vy" data-en="Vy projects">
                                    <i class="fas fa-tasks"></i>
                                    <span id="quickBtn3">${this.getQuickBtnText(3)}</span>
                                </button>
                                <button class="quick-question-btn btn-cv" data-vi="Kinh nghiệm của Vy" data-en="Vy experience">
                                    <i class="fas fa-briefcase"></i>
                                    <span id="quickBtn4">${this.getQuickBtnText(4)}</span>
                                </button>
                                <button class="quick-question-btn btn-cv" data-vi="Học vấn của Vy" data-en="Vy education">
                                    <i class="fas fa-graduation-cap"></i>
                                    <span id="quickBtn5">${this.getQuickBtnText(5)}</span>
                                </button>
                                <button class="quick-question-btn btn-cv" data-vi="Liên hệ với Vy" data-en="Contact Vy">
                                    <i class="fas fa-envelope"></i>
                                    <span id="quickBtn6">${this.getQuickBtnText(6)}</span>
                                </button>
                            </div>
                        </div>
                        <form class="chat-widget-form" id="chatWidgetForm">
                            <textarea
                                class="chat-widget-input"
                                id="chatWidgetInput"
                                placeholder="${this.getPlaceholderText()}"
                                rows="1"
                            ></textarea>
                            <button type="submit" class="chat-widget-send-btn" id="chatWidgetSend" title="${this.getSendText()}">
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
                const msg = this.lang === 'vn' ? btn.getAttribute('data-vi') : btn.getAttribute('data-en');
                const input = document.getElementById('chatWidgetInput');
                input.value = msg;
                this.handleSubmit({ preventDefault: () => {} });
            });
        });
    }

    // Các hàm helper để lấy text theo ngôn ngữ
    getOnlineText() {
        return this.lang === 'vn' ? 'Online • Sẵn sàng hỗ trợ' : 'Online • Ready to help';
    }

    getCloseText() {
        return this.lang === 'vn' ? 'Đóng' : 'Close';
    }

    getWelcomeTitle() {
        return this.lang === 'vn' ? 'Xin chào! 👋' : 'Hello! 👋';
    }

    getWelcomeText1() {
        return this.lang === 'vn'
            ? 'Tôi là AI Assistant, trợ lý thông minh của bạn. Hãy hỏi tôi bất cứ điều gì bạn muốn biết!'
            : 'I\'m your AI Assistant! Ask me anything you want to know!';
    }

    getWelcomeText2() {
        return this.lang === 'vn'
            ? 'I\'m your AI Assistant! Ask me anything you want to know!'
            : 'Tôi là AI Assistant, trợ lý thông minh của bạn. Hãy hỏi tôi bất cứ điều gì bạn muốn biết!';
    }

    getQuickBtnText(btnNumber) {
        const texts = {
            vn: ['Giới thiệu', 'Kỹ năng', 'Dự án', 'Kinh nghiệm', 'Học vấn', 'Liên hệ'],
            us: ['About', 'Skills', 'Projects', 'Experience', 'Education', 'Contact']
        };
        return texts[this.lang][btnNumber - 1] || texts.us[btnNumber - 1];
    }

    getPlaceholderText() {
        return this.lang === 'vn' ? 'Nhập tin nhắn của bạn...' : 'Type your message...';
    }

    getSendText() {
        return this.lang === 'vn' ? 'Gửi tin nhắn' : 'Send message';
    }

    // Cập nhật UI khi thay đổi ngôn ngữ
    updateChatUI() {
        // Cập nhật các text elements
        const elements = {
            'chatAssistantTitle': 'AI Assistant',
            'chatOnlineStatus': this.getOnlineText(),
            'chatWelcomeTitle': this.getWelcomeTitle(),
            'chatWelcomeText1': this.getWelcomeText1(),
            'chatWelcomeText2': this.getWelcomeText2()
        };

        Object.entries(elements).forEach(([id, text]) => {
            const element = document.getElementById(id);
            if (element) element.textContent = text;
        });

        // Cập nhật quick buttons
        for (let i = 1; i <= 6; i++) {
            const btn = document.getElementById(`quickBtn${i}`);
            if (btn) btn.textContent = this.getQuickBtnText(i);
        }

        // Cập nhật placeholder và title
        const input = document.getElementById('chatWidgetInput');
        if (input) input.placeholder = this.getPlaceholderText();

        const sendBtn = document.getElementById('chatWidgetSend');
        if (sendBtn) sendBtn.title = this.getSendText();

        const closeBtn = document.getElementById('chatWidgetClose');
        if (closeBtn) closeBtn.title = this.getCloseText();
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
        container.style.height = '630px';
        container.style.bottom = '0px'; // Ensure it sticks to the bottom
        widget.classList.add('widget-open');
        this.isOpen = true;
        if (window.innerWidth <= 768) {
            document.body.classList.add('chat-widget-open');
            document.body.style.overflow = 'hidden';
        }
        this.removeNotificationBadge();
        this.updateStatus(`<span class="status-indicator"></span>${this.lang === 'vn' ? 'Online • Đang trò chuyện' : 'Online • Chatting'}`);
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
        this.updateStatus(`<span class="status-indicator"></span>${this.lang === 'vn' ? 'Offline' : 'Offline'}`);
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
        this.updateStatus(`<span class="status-indicator"></span>${this.lang === 'vn' ? 'Đang suy nghĩ...' : 'Thinking...'}`);

        // If chatbotData is still null, use fallback
        if (!this.chatbotData) {
            this.useFallbackData();
        }

        if (!this.chatbotData) {
            this.addMessage(this.lang === 'vn' ? 'Xin lỗi, tôi đang gặp vấn đề kỹ thuật. Vui lòng thử lại sau.' : 'Sorry, I\'m having technical issues. Please try again later.', 'bot');
            this.updateStatus(`<span class="status-indicator"></span>${this.getOnlineText()}`);
            return;
        }

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
            this.addMessage(this.lang === 'vn' ? 'Đang tải dữ liệu...' : 'Loading data...', 'bot');
            return;
        }
        const msg = message.toLowerCase();
        // Chuẩn hóa để nhận diện các nút quick question
        const msgNoSpace = msg.replace(/\s+/g, '');
        if (msg.includes('english') || msg.includes('tiếng anh')) {
            this.lang = 'us';
            localStorage.setItem('language', 'us'); // Sync với language switcher
            this.addMessage('Switched to English 🇺🇸', 'bot');
            this.updateChatUI();
            return;
        }
        if (msg.includes('vietnamese') || msg.includes('tiếng việt')) {
            this.lang = 'vn';
            localStorage.setItem('language', 'vn'); // Sync với language switcher
            this.addMessage('Đã chuyển sang tiếng Việt 🇻🇳', 'bot');
            this.updateChatUI();
            return;
        }
        let reply = '';
        // Ưu tiên kiểm tra kinh nghiệm trước giới thiệu
        if (
            msg.includes('kinh nghiệm') ||
            msg.includes('experience') ||
            msg.includes('làm việc') ||
            msg.includes('work') ||
            msgNoSpace.includes('kinhnghiệmcủavy') ||
            msgNoSpace.includes('vyexperience')
        ) {
            reply = this.chatbotData.experience[this.lang];
        } else if (msg.includes('chào') || msg.includes('hello') || msg.includes('hi')) {
            reply = this.chatbotData.greeting[this.lang];
        } else if (msg.includes('giới thiệu') || msg.includes('about') || msg.includes('về bạn') || msg.includes('who is')) {
            reply = this.chatbotData.about[this.lang];
        } else if (msg.includes('dự án') || msg.includes('project') || msg.includes('portfolio')) {
            reply = this.chatbotData.projects[this.lang];
        } else if (msg.includes('kỹ năng') || msg.includes('skill') || msg.includes('công nghệ') || msg.includes('technology')) {
            reply = this.chatbotData.skills[this.lang];
        } else if (msg.includes('liên hệ') || msg.includes('contact') || msg.includes('email')) {
            reply = this.chatbotData.contact[this.lang];
        } else if (msg.includes('học vấn') || msg.includes('education') || msg.includes('trường') || msg.includes('university')) {
            reply = this.chatbotData.education[this.lang];
        } else {
            reply = this.lang === 'vn'
                ? 'Bạn có thể hỏi về: Giới thiệu, Kỹ năng, Dự án, Kinh nghiệm, Học vấn, Liên hệ của Vy nhé!'
                : 'You can ask about: About, Skills, Projects, Experience, Education, or Contact Vy!';
        }
        this.addMessage(reply, 'bot');
        this.updateStatus(`<span class="status-indicator"></span>${this.getOnlineText()}`);
    }
}

// Khởi tạo widget khi trang đã load
document.addEventListener('DOMContentLoaded', () => {
    try {
        new ChatWidget();
        console.log('Chat widget initialized successfully');
    } catch (error) {
        console.error('Failed to initialize chat widget:', error);
        // Try again after a delay
        setTimeout(() => {
            try {
                new ChatWidget();
                console.log('Chat widget initialized on second attempt');
            } catch (retryError) {
                console.error('Chat widget initialization failed completely:', retryError);
            }
        }, 2000);
    }
});

// Alternative initialization for older browsers
window.addEventListener('load', () => {
    if (!document.querySelector('.chat-widget')) {
        try {
            new ChatWidget();
            console.log('Chat widget initialized via window load event');
        } catch (error) {
            console.error('Window load initialization failed:', error);
        }
    }
});
