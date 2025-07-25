// Chat Widget Configuration
window.ChatConfig = {
    // API Endpoints
    APIs: {
        LOCAL: '/api/chat.php',
        LOCAL_WITH_PORT: 'http://localhost:8000/api/chat.php',
        EXTERNAL: 'http://170.64.160.231:5000/api/chat',
        DEFAULT: 'http://170.64.160.231:5000/api/chat'
    },

    // Widget Settings
    settings: {
        useRealAPI: true,
        enableCache: true,
        minResponseTime: 500,
        maxCacheSize: 100,
        debounceDelay: 300,
        autoRetry: true,
        retryCount: 3
    },

    // Current API status
    status: {
        currentAPI: 'DEFAULT',
        lastTest: null,
        isOnline: false
    },

    // Helper functions
    switchToLocal: function() {
        if (window.chatWidget) {
            window.chatWidget.setApiUrl(this.APIs.LOCAL);
            this.status.currentAPI = 'LOCAL';
            console.log('🔄 Switched to Local API:', this.APIs.LOCAL);
        }
    },

    switchToLocalWithPort: function() {
        if (window.chatWidget) {
            window.chatWidget.setApiUrl(this.APIs.LOCAL_WITH_PORT);
            this.status.currentAPI = 'LOCAL_WITH_PORT';
            console.log('🔄 Switched to Local API with port:', this.APIs.LOCAL_WITH_PORT);
        }
    },

    switchToExternal: function() {
        if (window.chatWidget) {
            window.chatWidget.setApiUrl(this.APIs.EXTERNAL);
            this.status.currentAPI = 'EXTERNAL';
            console.log('🔄 Switched to External API:', this.APIs.EXTERNAL);
        }
    },

    switchToDefault: function() {
        if (window.chatWidget) {
            window.chatWidget.setApiUrl(this.APIs.DEFAULT);
            this.status.currentAPI = 'DEFAULT';
            console.log('🔄 Switched to Default API:', this.APIs.DEFAULT);
        }
    },

    // Test connections
    testAll: async function() {
        console.log('🧪 Testing all API endpoints...');
        const results = {};
        this.status.lastTest = new Date().toISOString();

        for (const [name, url] of Object.entries(this.APIs)) {
            console.log(`Testing ${name}: ${url}`);
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000);

                const startTime = Date.now();
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: 'test connection' }),
                    signal: controller.signal
                });

                clearTimeout(timeoutId);
                const responseTime = Date.now() - startTime;

                if (response.ok) {
                    const data = await response.json();
                    results[name] = {
                        status: '✅ OK',
                        responseTime: `${responseTime}ms`,
                        response: data.reply ? data.reply.substring(0, 50) + '...' : 'Success'
                    };
                } else {
                    results[name] = {
                        status: '❌ ERROR',
                        responseTime: `${responseTime}ms`,
                        response: `HTTP ${response.status}`
                    };
                }
            } catch (error) {
                results[name] = {
                    status: '🚫 FAILED',
                    responseTime: 'N/A',
                    response: error.name === 'AbortError' ? 'Timeout' : error.message
                };
            }
        }

        console.table(results);
        this.status.isOnline = Object.values(results).some(r => r.status === '✅ OK');
        return results;
    },

    // Get current status
    getStatus: function() {
        return {
            currentAPI: this.status.currentAPI,
            currentURL: window.chatWidget ? window.chatWidget.apiUrl : 'Not initialized',
            lastTest: this.status.lastTest,
            isOnline: this.status.isOnline,
            widgetLoaded: !!window.chatWidget,
            widgetOpen: window.chatWidget ? window.chatWidget.isOpen : false
        };
    },

    // Auto-switch to best available API
    autoSwitch: async function() {
        console.log('🔄 Auto-switching to best available API...');
        const results = await this.testAll();

        // Priority order: LOCAL_WITH_PORT > LOCAL > EXTERNAL > DEFAULT
        const priority = ['LOCAL_WITH_PORT', 'LOCAL', 'EXTERNAL', 'DEFAULT'];

        for (const apiName of priority) {
            if (results[apiName] && results[apiName].status === '✅ OK') {
                this[`switchTo${apiName.charAt(0) + apiName.slice(1).toLowerCase().replace('_with_port', 'WithPort')}`]();
                console.log(`✅ Auto-switched to ${apiName}`);
                return apiName;
            }
        }

        console.warn('⚠️ No working API found');
        return null;
    }
};

// Global helper functions
window.switchToLocalAPI = () => window.ChatConfig.switchToLocal();
window.switchToLocalWithPortAPI = () => window.ChatConfig.switchToLocalWithPort();
window.switchToExternalAPI = () => window.ChatConfig.switchToExternal();
window.switchToDefaultAPI = () => window.ChatConfig.switchToDefault();
window.testAllAPIs = () => window.ChatConfig.testAll();
window.getChatStatus = () => window.ChatConfig.getStatus();
window.autoSwitchAPI = () => window.ChatConfig.autoSwitch();

// Quick setup functions for different environments
window.setupLocalDev = function() {
    console.log('🛠️ Setting up for Local Development...');
    window.switchToLocalWithPortAPI();
    console.log('💡 Make sure PHP server is running: php -S localhost:8000');
};

window.setupProduction = function() {
    console.log('🚀 Setting up for Production...');
    window.switchToExternalAPI();
};

console.log('🔧 Chat Widget Config loaded. Available APIs:', Object.keys(window.ChatConfig.APIs));
console.log('📋 Available commands:');
console.log('  - testAllAPIs() - Test all endpoints');
console.log('  - switchToLocalAPI() - Switch to local API');
console.log('  - switchToLocalWithPortAPI() - Switch to local API with port');
console.log('  - switchToExternalAPI() - Switch to external API');
console.log('  - getChatStatus() - Get current status');
console.log('  - autoSwitchAPI() - Auto-switch to best API');
console.log('  - setupLocalDev() - Quick setup for local development');
console.log('  - setupProduction() - Quick setup for production');
