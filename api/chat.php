<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['message'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing message parameter']);
    exit;
}

$message = trim($input['message']);

if (empty($message)) {
    http_response_code(400);
    echo json_encode(['error' => 'Empty message']);
    exit;
}

// Simple chatbot responses based on keywords
function getChatbotResponse($message) {
    $message = strtolower($message);

    // Responses about the owner/portfolio
    if (strpos($message, 'xin chào') !== false || strpos($message, 'hello') !== false || strpos($message, 'hi') !== false) {
        return "Xin chào! Tôi là AI Assistant của Vz. Tôi có thể giúp bạn tìm hiểu về portfolio, kinh nghiệm và các dự án của bạn ấy. Bạn muốn biết điều gì?";
    }

    if (strpos($message, 'portfolio') !== false || strpos($message, 'dự án') !== false || strpos($message, 'project') !== false) {
        return "Vz có nhiều dự án thú vị như:\n• 🎬 Movie Booking System - Hệ thống đặt vé xem phim\n• 🐦 Flappy Bird Game - Game giải trí\n• 📚 Hotel Booking System - Hệ thống đặt phòng khách sạn\n\nBạn muốn tìm hiểu chi tiết về dự án nào?";
    }

    if (strpos($message, 'kỹ năng') !== false || strpos($message, 'skill') !== false || strpos($message, 'công nghệ') !== false) {
        return "Vz có các kỹ năng:\n• 💻 Frontend: HTML, CSS, JavaScript, Bootstrap, jQuery\n• 🖥️ Backend: PHP, Java, C#, Node.js\n• 🗄️ Database: MySQL, MongoDB\n• 🛠️ Tools: Git, Docker, VS Code\n• 🎨 Design: Figma, Photoshop";
    }

    if (strpos($message, 'liên hệ') !== false || strpos($message, 'contact') !== false || strpos($message, 'email') !== false) {
        return "Bạn có thể liên hệ với Vz qua:\n📧 Email: tongvynha@gmail.com\n📱 Phone: +84 123 456 789\n🌐 LinkedIn: linkedin.com/in/tongvynha\n📍 Địa chỉ: TP. Hồ Chí Minh, Việt Nam";
    }


    if (strpos($message, 'kinh nghiệm') !== false || strpos($message, 'experience') !== false || strpos($message, 'làm việc') !== false) {
        return "Kinh nghiệm làm việc:\n👨‍💻 Frontend Developer - ABC Company (6 tháng)\n🎯 Fresher Developer - XYZ Tech (3 tháng)\n📝 Tham gia các dự án thực tế về web development\n🏆 Hoàn thành 10+ dự án cá nhân";
    }

    if (strpos($message, 'sở thích') !== false || strpos($message, 'hobby') !== false || strpos($message, 'thích') !== false) {
        return "Sở thích của Vz:\n🎮 Chơi game và phát triển game\n📚 Đọc sách về công nghệ\n🎵 Nghe nhạc và xem phim\n🏃‍♂️ Thể thao và du lịch\n💻 Học hỏi công nghệ mới";
    }

    if (strpos($message, 'cv') !== false || strpos($message, 'resume') !== false || strpos($message, 'tải') !== false) {
        return "Bạn có thể tải CV của Vz tại phần About trong website này. CV có sẵn cả tiếng Việt và tiếng Anh, bao gồm phiên bản Fresher và Intern. Chỉ cần click vào nút 'Download CV' và chọn phiên bản phù hợp!";
    }

    if (strpos($message, 'movie') !== false || strpos($message, 'phim') !== false) {
        return "🎬 Movie System là một trong những dự án nổi bật:\n• Hệ thống xem phim online\n• Giao diện thân thiện, dễ sử dụng\n•Công nghệ: C# .NET, SQL server, Bootstrap, JavaScript";
    }

    if (strpos($message, 'flappy') !== false || strpos($message, 'bird') !== false || strpos($message, 'game') !== false) {
        return "🐦 Flappy Bird Game - Dự án game giải trí:\n• Phiên bản web của game Flappy Bird nổi tiếng\n• Sử dụng python\n• Có hệ thống điểm số\n• Chỉ chơi được trên laptop =]]]\n• Âm thanh và hiệu ứng sinh động";
    }

    if (strpos($message, 'hotel') !== false || strpos($message, 'khách sạn') !== false) {
        return "🏨 Hotel Booking System:\n• Hệ thống đặt phòng khách sạn trực tuyến\n• Tìm kiếm và lọc phòng theo tiêu chí\n• Quản lý đặt phòng và thanh toán\n• Admin panel cho quản lý khách sạn\n• Công nghệ: C# .NET, SQL server, Bootstrap, JavaScript";
    }

    if (strpos($message, 'cảm ơn') !== false || strpos($message, 'thanks') !== false || strpos($message, 'thank you') !== false) {
        return "Cảm ơn bạn đã quan tâm đến portfolio của Vz! 😊 Nếu bạn có thêm câu hỏi nào khác về dự án, kỹ năng hay kinh nghiệm, đừng ngần ngại hỏi nhé. Chúc bạn một ngày tốt lành! 🌟";
    }

    if (strpos($message, 'bye') !== false || strpos($message, 'tạm biệt') !== false || strpos($message, 'goodbye') !== false) {
        return "Tạm biệt và cảm ơn bạn đã ghé thăm! 👋 Hy vọng bạn đã có được thông tin hữu ích về Vz. Chúc bạn thành công và hẹn gặp lại! 🌟";
    }

    // Test connection
    if (strpos($message, 'test connection') !== false) {
        return "Kết nối API thành công! AI Assistant đang hoạt động tốt. 🚀";
    }

    // Default responses for unrecognized input
    $defaultResponses = [
        "Tôi là AI Assistant của Vz. Bạn có thể hỏi tôi về portfolio, kỹ năng, dự án, kinh nghiệm của bạn ấy. Bạn muốn biết điều gì cụ thể?",
        "Bạn có thể hỏi tôi về các dự án như Movie Booking System, Flappy Bird Game, hoặc về kỹ năng lập trình của Vz!",
        "Tôi có thể giúp bạn tìm hiểu về học vấn, kinh nghiệm làm việc, và sở thích của Vz. Bạn quan tâm đến phần nào?",
        "Hãy thử hỏi tôi về 'portfolio', 'kỹ năng', 'liên hệ', 'dự án' hoặc bất kỳ điều gì bạn muốn biết về Vz!"
    ];

    return $defaultResponses[array_rand($defaultResponses)];
}

// Get response
$response = getChatbotResponse($message);

// Add some delay to simulate processing (remove in production)
usleep(500000); // 0.5 second delay

// Return response
echo json_encode([
    'reply' => $response,
    'timestamp' => date('Y-m-d H:i:s'),
    'status' => 'success'
]);
?>
