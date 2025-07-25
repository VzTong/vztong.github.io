# 🤖 Chat Widget API Configuration Guide

## 📋 Tổng quan

Chat Widget hỗ trợ 2 loại API:
- **Local API**: `/api/chat.php` (chạy trên cùng server với website)
- **External API**: `http://170.64.160.231:5000/api/chat` (server từ xa)

## 🚀 Cách chuyển đổi API

### 1. Chuyển đổi qua JavaScript Console

Mở **Developer Tools** (F12) → **Console** và gõ:

```javascript
// Chuyển sang External API (mặc định)
switchToExternalAPI()

// Chuyển sang Local API
switchToLocalAPI()

// Test tất cả API endpoints
testAllAPIs()

// Kiểm tra trạng thái hiện tại
getChatWidgetStatus()
```

### 2. Chuyển đổi trong code

#### Sửa file `js/chat-widget.js`:

```javascript
// Dòng 9-10, thay đổi apiUrl:

// Sử dụng Local API:
this.apiUrl = '/api/chat.php';

// Hoặc sử dụng External API:
this.apiUrl = 'http://170.64.160.231:5000/api/chat';
```

#### Sửa file `js/chat-config.js`:

```javascript
// Thay đổi DEFAULT API:
APIs: {
    LOCAL: '/api/chat.php',
    EXTERNAL: 'http://170.64.160.231:5000/api/chat',
    DEFAULT: '/api/chat.php'  // ← Thay đổi ở đây
}
```

## 🔧 Yêu cầu cho Local API

### Để sử dụng `/api/chat.php`, bạn cần:

1. **PHP Server** đang chạy
2. **File chat.php** trong thư mục `/api/`
3. **CORS headers** được cấu hình đúng

### Khởi động PHP Server:

```bash
# Tại thư mục gốc project
php -S localhost:8000

# Hoặc với XAMPP/WAMP
# Đặt project trong htdocs/www
```

### Cấu hình URL cho Local:

```javascript
// Nếu chạy PHP server trên port 8000:
this.apiUrl = 'http://localhost:8000/api/chat.php';

// Nếu dùng XAMPP (port 80):
this.apiUrl = 'http://localhost/your-project-name/api/chat.php';
```

## 📊 So sánh API

| Feature | Local API | External API |
|---------|-----------|--------------|
| **Tốc độ** | ⚡ Nhanh | 🌐 Phụ thuộc mạng |
| **Tùy chỉnh** | ✅ Hoàn toàn | ❌ Hạn chế |
| **Bảo mật** | 🔒 Riêng tư | ⚠️ Public |
| **Dữ liệu** | 📝 Portfolio cá nhân | 🏫 Dữ liệu trường học |
| **Setup** | 🛠️ Cần PHP server | ✅ Sẵn sàng |

## 🔍 Debug & Testing

### Kiểm tra API hoạt động:

```bash
# Test Local API
curl -X POST "http://localhost:8000/api/chat.php" \
  -H "Content-Type: application/json" \
  -d '{"message":"xin chào"}'

# Test External API
curl -X POST "http://170.64.160.231:5000/api/chat" \
  -H "Content-Type: application/json" \
  -d '{"message":"xin chào"}'
```

### Debug trong Console:

```javascript
// Xem cấu hình hiện tại
console.log(window.ChatConfig.APIs);

// Test từng API
window.ChatConfig.testAll();

// Xem trạng thái widget
window.chatWidget.testWidget();

// Kiểm tra kết nối API hiện tại
window.chatWidget.testApiConnection();
```

## ⚙️ Cấu hình nâng cao

### Thêm API mới trong `chat-config.js`:

```javascript
APIs: {
    LOCAL: '/api/chat.php',
    EXTERNAL: 'http://170.64.160.231:5000/api/chat',
    CUSTOM: 'https://your-custom-api.com/chat',
    DEFAULT: 'http://170.64.160.231:5000/api/chat'
}
```

### Tạo function chuyển đổi:

```javascript
window.switchToCustomAPI = function() {
    window.chatWidget.setApiUrl(window.ChatConfig.APIs.CUSTOM);
};
```

## 🚨 Lỗi thường gặp

### 1. "Could not establish connection"
- ✅ Kiểm tra server có chạy không
- ✅ Kiểm tra URL đúng chưa
- ✅ Kiểm tra CORS headers

### 2. "Method not allowed"
- ✅ Đảm bảo sử dụng POST method
- ✅ Kiểm tra API endpoint

### 3. "Missing message parameter"
- ✅ Kiểm tra JSON format đúng
- ✅ Đảm bảo có field "message"

## 📝 Ví dụ thực tế

### Setup Local Development:

```bash
# 1. Khởi động PHP server
cd /path/to/your/project
php -S localhost:8000

# 2. Mở browser console và chuyển API
switchToLocalAPI()

# 3. Test chat widget
testChatWidget()
```

### Deploy Production:

```javascript
// Trong production, sử dụng external API
// Sửa chat-config.js:
DEFAULT: 'http://170.64.160.231:5000/api/chat'
```

## 🎯 Khuyến nghị

- **Development**: Sử dụng Local API để test & customize
- **Production**: Sử dụng External API cho độ ổn định
- **Testing**: Luôn test cả 2 API trước khi deploy

---

💡 **Tip**: Sử dụng `testAllAPIs()` để nhanh chóng kiểm tra trạng thái tất cả API endpoints!
