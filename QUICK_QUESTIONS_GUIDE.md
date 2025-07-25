# 🚀 Quick Questions Widget Guide

## Tổng quan
Quick Questions là tính năng mới được thêm vào chat widget, cho phép người dùng dễ dàng bắt đầu cuộc trò chuyện bằng các câu hỏi có sẵn thay vì phải gõ từng từ.

## ✨ Tính năng

### 📱 Giao diện Quick Questions
- **Hiển thị**: Xuất hiện ngay dưới lời chào trong chat widget
- **Design**: Grid layout responsive với icons và text
- **Animation**: Fade in effect và hover animations
- **Mobile-friendly**: Tối ưu cho điện thoại

### 🎯 Các câu hỏi có sẵn
1. **👤 Giới thiệu về bạn** - Thông tin cơ bản về chủ sở hữu portfolio
2. **📊 Các dự án đã làm** - Danh sách các dự án đã thực hiện
3. **💻 Kỹ năng lập trình** - Công nghệ và kỹ năng technical
4. **📧 Thông tin liên hệ** - Email, phone, social media
5. **💼 Kinh nghiệm làm việc** - Lịch sử công việc và internship
6. **🎓 Học vấn** - Trình độ học vấn và chứng chỉ

## 🔧 Cách hoạt động

### Khi mở chat widget:
```
1. Hiển thị welcome message
2. Hiển thị 6 quick question buttons
3. User có thể click vào bất kỳ button nào
4. Hoặc gõ câu hỏi tự do vào input
```

### Khi click quick question:
```
1. Ẩn quick questions và welcome message
2. Thêm câu hỏi vào chat như user message
3. Gửi câu hỏi đến API chat.php
4. Hiển thị response từ bot
```

## 🎨 Styling và Theme

### CSS Variables được sử dụng:
```css
--color-bg          /* Background của buttons */
--color-bg-2        /* Background của container */
--color-text        /* Text color */
--color-hover       /* Hover color và icons */
--color-border      /* Border color */
--color-white       /* White text khi hover */
```

### Responsive Breakpoints:
- **Desktop**: 2 columns grid
- **Tablet (≤768px)**: 2 columns, smaller buttons  
- **Mobile (≤480px)**: 1 column, horizontal layout

## 🛠️ Customization

### Thêm câu hỏi mới:
1. Mở `js/chat-widget.js`
2. Tìm `.quick-questions-grid` trong `createWidget()`
3. Thêm button mới:
```html
<button class="quick-question-btn" data-question="Câu hỏi mới">
    <i class="fas fa-icon-name"></i>
    <span>Label hiển thị</span>
</button>
```

### Thay đổi styling:
1. Mở `css/chat-widget.css`
2. Tìm section `/* Quick Questions Styles */`
3. Chỉnh sửa theo ý muốn

### Chỉnh sửa API responses:
1. Mở `api/chat.php`
2. Thêm keywords và responses trong `getChatbotResponse()`

## 🎮 Console Commands

```javascript
// Reset chat về trạng thái ban đầu (hiển thị lại quick questions)
resetChatWidget()

// Mở widget và test quick questions
openChatWidget()

// Check status
getChatWidgetStatus()
```

## 📱 Mobile Experience

### Optimizations:
- Touch-friendly button size (45px min-height)
- Horizontal layout trên màn hình nhỏ
- Smooth animations
- No zoom issues

### Gestures:
- **Tap**: Select quick question
- **Scroll**: Scroll chat messages
- **Swipe**: Natural scrolling

## 🔄 API Integration

### Default Setup:
- **Primary**: `/api/chat.php` (Local PHP)
- **Fallback**: External API nếu local fail
- **Response format**: JSON với `reply` field

### Keywords được xử lý trong chat.php:
- "giới thiệu", "về bạn" → Personal info
- "dự án", "portfolio", "project" → Projects list
- "kỹ năng", "skill", "công nghệ" → Technical skills
- "liên hệ", "contact" → Contact information
- "kinh nghiệm", "experience" → Work experience
- "học vấn", "education" → Education background

## 🐛 Troubleshooting

### Quick questions không hiển thị:
```javascript
// Check widget status
getChatWidgetStatus()

// Reset widget
resetChatWidget()
```

### Buttons không click được:
1. Kiểm tra event listeners đã load
2. Check console errors
3. Refresh page

### CSS không load đúng:
1. Verify `chat-widget.css` được include
2. Check CSS variables từ main theme
3. Clear browser cache

## 🎯 Best Practices

### UX Guidelines:
- **Immediate feedback**: Button click → instant response
- **Clear labels**: Descriptive text cho mỗi button
- **Logical grouping**: Related questions gần nhau
- **Progressive disclosure**: Ẩn sau lần tương tác đầu

### Performance:
- **Lazy loading**: Quick questions chỉ render khi cần
- **Event delegation**: Single listener cho tất cả buttons
- **CSS optimization**: Efficient selectors và animations

## 🚀 Future Enhancements

### Có thể thêm:
1. **Dynamic questions**: Load từ API
2. **Personalization**: Questions dựa trên user behavior
3. **Categories**: Group questions theo topic
4. **Search**: Tìm kiếm trong quick questions
5. **Analytics**: Track popular questions

### Ideas:
- Suggest questions based on current page
- Add "More questions" expandable section
- Integration với knowledge base
- Multi-language support

## 📊 Analytics

### Metrics để track:
- Quick question click rates
- Most popular questions
- Conversion from quick → custom questions
- Mobile vs desktop usage

---

**📝 Note**: Quick Questions được thiết kế để cải thiện user experience và giảm barrier to entry cho chat widget. Nó đặc biệt hữu ích cho users không biết nên hỏi gì hoặc muốn explore nhanh portfolio.
