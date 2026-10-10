# LungDx

<p align="center">
  <img src="https://img.shields.io/badge/LungDx-Chest%20X--Ray%20Diagnosis-0A66C2?style=for-the-badge&logo=python&logoColor=white" alt="LungDx"/>
</p>

<p align="center">
  <strong>Web application for lung disease diagnosis from chest X-ray images using Deep Learning</strong><br>
  <strong>Ứng dụng web chẩn đoán bệnh phổi từ ảnh X-quang ngực sử dụng Deep Learning</strong>
</p>

<p align="center">
  <a href="#english">English</a> •
  <a href="#tiếng-việt">Tiếng Việt</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.9+-3776AB?style=flat-square&logo=python&logoColor=white" alt="Python"/>
  <img src="https://img.shields.io/badge/Flask-2.3+-000000?style=flat-square&logo=flask&logoColor=white" alt="Flask"/>
  <img src="https://img.shields.io/badge/TensorFlow-2.12+-FF6F00?style=flat-square&logo=tensorflow&logoColor=white" alt="TensorFlow"/>
  <img src="https://img.shields.io/badge/OpenCV-4.8+-5C3EE8?style=flat-square&logo=opencv&logoColor=white" alt="OpenCV"/>
  <img src="https://img.shields.io/badge/Socket.IO-4.x-010101?style=flat-square&logo=socketdotio&logoColor=white" alt="Socket.IO"/>
  <img src="https://img.shields.io/badge/Bootstrap-5.3-7952B3?style=flat-square&logo=bootstrap&logoColor=white" alt="Bootstrap"/>
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License"/>
</p>

---

# English

> ⚠️ **Disclaimer**
> This application is a **decision-support tool only**. Results must **not** replace professional clinical diagnosis. Always consult qualified medical experts.

## Features

- **Image Input**: Upload chest X-ray images (drag & drop / file picker) or provide an image URL
- **Multiple Models**:
  | Model Key                | Architecture     | Description                                      |
  |--------------------------|------------------|--------------------------------------------------|
  | `lung_cnn_v0`            | Custom CNN       | Built-in CNN with custom MeanPool / MaxPool layers |
  | `lung_resnet50_v1`       | ResNet50         | Transfer learning                                |
  | `lung_mobilenetv2_v1`    | MobileNetV2      | Lightweight transfer learning                    |
  | `lung_efficientnetb0_v1` | EfficientNetB0   | Efficient transfer learning                      |
- **Ensemble Prediction**: Weighted average across loaded models for more robust results
- **Pre-check**: Validates whether the input looks like a chest X-ray (aspect ratio + intensity distribution)
- **Pneumonia Feature Detection**: Heuristic check for opacity regions; issues a low-confidence warning when appropriate
- **Real-time Progress**: Live progress updates via Socket.IO
- **History Management**: Stores up to 100 diagnosis records with view / delete support
- **Modern UI**: Dark / Light mode, responsive design, Bootstrap 5

### Classification Classes

| English                    | Vietnamese                  |
|---------------------------|-----------------------------|
| Normal                    | Bình thường                 |
| Bacterial Pneumonia       | Viêm phổi do vi khuẩn       |
| Corona Virus Disease      | Bệnh do virus Corona        |
| Tuberculosis              | Lao phổi                    |
| Viral Pneumonia           | Viêm phổi do virus          |

## Tech Stack

<p align="left">
  <img src="https://img.shields.io/badge/Backend-Flask-000000?style=for-the-badge&logo=flask&logoColor=white" alt="Flask"/>
  <img src="https://img.shields.io/badge/Realtime-Socket.IO-010101?style=for-the-badge&logo=socketdotio&logoColor=white" alt="Socket.IO"/>
  <img src="https://img.shields.io/badge/Deep%20Learning-TensorFlow%20%2F%20Keras-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white" alt="TensorFlow"/>
  <img src="https://img.shields.io/badge/Computer%20Vision-OpenCV-5C3EE8?style=for-the-badge&logo=opencv&logoColor=white" alt="OpenCV"/>
  <img src="https://img.shields.io/badge/Frontend-Bootstrap%205-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white" alt="Bootstrap"/>
  <img src="https://img.shields.io/badge/Language-Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python"/>
</p>

| Layer              | Technology                                      |
|--------------------|-------------------------------------------------|
| Backend            | Flask + Flask-SocketIO                          |
| Deep Learning      | TensorFlow / Keras                              |
| Image Processing   | OpenCV, Pillow, NumPy, SciPy                    |
| Frontend           | HTML5, Bootstrap 5, jQuery, Socket.IO client    |
| Model Formats      | Keras (`.keras`)                                |

## Installation

### Prerequisites

- Python **3.9+**
- Recommended: 8 GB+ RAM (multiple models loaded simultaneously)
- GPU optional (speeds up inference)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/VzTong/LungDx.git
cd LungDx

# 2. Create and activate virtual environment
python -m venv venv

# Windows
venv\Scripts\activate

# Linux / macOS
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt
```

### Prepare Models

Create a `model/` directory and place the trained weights with **exact filenames**:

```
model/
├── lung_cnn_model_v0.keras
├── lung_resnet50_model_v1.keras
├── lung_mobilenetv2_model_v1.keras
└── lung_efficientnetb0_model_v1.keras
```

On first run the application automatically converts each model to a `_converted.keras` version if it does not already exist.

## Usage

```bash
python app.py
```

Open your browser and navigate to:

```
http://localhost:5000
```

| Route       | Description                |
|-------------|----------------------------|
| `/`         | Main diagnosis page        |
| `/history`  | Diagnosis history          |

## API Reference

| Method   | Endpoint                      | Description                              |
|----------|-------------------------------|------------------------------------------|
| `GET`    | `/`                           | Render diagnosis page                    |
| `GET`    | `/history`                    | Render history page                      |
| `POST`   | `/analyze`                    | Analyze uploaded image or image URL      |
| `GET`    | `/model_status`               | Return loading status of each model      |
| `DELETE` | `/delete_history/<index>`     | Delete a history entry by index          |

### Socket.IO Events

| Event       | Direction       | Payload example                          |
|-------------|-----------------|------------------------------------------|
| `progress`  | Server → Client | `{ "percentage": 75 }`                   |
| `result`    | Server → Client | Full analysis result object              |
| `error`     | Server → Client | `{ "message": "..." }`                   |
| `cancel`    | Client → Server | Cancel current analysis                  |
| `connected` | Server → Client | `{ "sid": "..." }`                       |

## Project Structure

```
LungDx/
├── app.py                              # Main Flask + SocketIO application
├── model/                              # Place .keras model files here (not committed)
├── static/
│   ├── Architecture/                   # Model architecture diagrams
│   ├── ConfusionMatrix/                # Confusion matrix images
│   ├── TrainingPlots/                  # Training / validation curves
│   ├── Uploads/                        # Runtime uploaded images
│   ├── script.js                       # Frontend logic
│   ├── style.css                       # Styles
│   └── model_training_version_comparison_hitory.json
├── templates/
│   ├── base.html
│   ├── index.html
│   └── history.html
├── history.json                        # Runtime diagnosis history
├── app.log                             # Runtime log file
├── requirements.txt
├── .gitignore
└── README.md
```

## Security Notes

The current `SECRET_KEY` is hard-coded:

```python
app.config['SECRET_KEY'] = 'your-secret-key'
```

**Recommended change** for any deployment:

```python
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-change-me')
```

Also ensure the following are **never committed** (already covered by `.gitignore`):

- `model/` and `*.keras` files
- `history.json`, `app.log`
- `static/Uploads/`
- `.env` files containing secrets

## Author

**VzTong**
GitHub: [https://github.com/VzTong](https://github.com/VzTong)

## License

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.

---

# Tiếng Việt

> ⚠️ **Tuyên bố miễn trừ**
> Ứng dụng này chỉ là **công cụ hỗ trợ quyết định**. Kết quả **không thay thế** chẩn đoán lâm sàng chuyên nghiệp. Luôn tham khảo ý kiến của các chuyên gia y tế có trình độ.

## Tính năng

- **Đầu vào ảnh**: Upload ảnh X-quang ngực (kéo-thả / chọn file) hoặc nhập URL ảnh
- **Nhiều mô hình**:
  | Model Key                | Kiến trúc        | Mô tả                                              |
  |--------------------------|------------------|----------------------------------------------------|
  | `lung_cnn_v0`            | CNN tùy chỉnh    | CNN tự xây dựng với lớp MeanPool / MaxPool tùy chỉnh |
  | `lung_resnet50_v1`       | ResNet50         | Transfer learning                                  |
  | `lung_mobilenetv2_v1`    | MobileNetV2      | Transfer learning nhẹ                              |
  | `lung_efficientnetb0_v1` | EfficientNetB0   | Transfer learning hiệu quả                         |
- **Ensemble Prediction**: Trung bình có trọng số giữa các mô hình đang load để tăng độ tin cậy
- **Kiểm tra sơ bộ**: Xác minh ảnh có giống X-quang ngực hay không (tỷ lệ khung hình + phân bố cường độ)
- **Phát hiện đặc trưng viêm phổi**: Kiểm tra heuristic vùng mờ; đưa ra cảnh báo độ tin cậy thấp khi cần
- **Tiến trình real-time**: Cập nhật tiến độ trực tiếp qua Socket.IO
- **Quản lý lịch sử**: Lưu tối đa 100 bản ghi chẩn đoán, hỗ trợ xem / xóa
- **Giao diện hiện đại**: Chế độ Dark / Light, responsive, Bootstrap 5

### Các lớp phân loại

| Tiếng Anh                  | Tiếng Việt                  |
|---------------------------|-----------------------------|
| Normal                    | Bình thường                 |
| Bacterial Pneumonia       | Viêm phổi do vi khuẩn       |
| Corona Virus Disease      | Bệnh do virus Corona        |
| Tuberculosis              | Lao phổi                    |
| Viral Pneumonia           | Viêm phổi do virus          |

## Công nghệ sử dụng

<p align="left">
  <img src="https://img.shields.io/badge/Backend-Flask-000000?style=for-the-badge&logo=flask&logoColor=white" alt="Flask"/>
  <img src="https://img.shields.io/badge/Realtime-Socket.IO-010101?style=for-the-badge&logo=socketdotio&logoColor=white" alt="Socket.IO"/>
  <img src="https://img.shields.io/badge/Deep%20Learning-TensorFlow%20%2F%20Keras-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white" alt="TensorFlow"/>
  <img src="https://img.shields.io/badge/Computer%20Vision-OpenCV-5C3EE8?style=for-the-badge&logo=opencv&logoColor=white" alt="OpenCV"/>
  <img src="https://img.shields.io/badge/Frontend-Bootstrap%205-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white" alt="Bootstrap"/>
  <img src="https://img.shields.io/badge/Language-Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python"/>
</p>

| Lớp                | Công nghệ                                       |
|--------------------|-------------------------------------------------|
| Backend            | Flask + Flask-SocketIO                          |
| Deep Learning      | TensorFlow / Keras                              |
| Xử lý ảnh          | OpenCV, Pillow, NumPy, SciPy                    |
| Frontend           | HTML5, Bootstrap 5, jQuery, Socket.IO client    |
| Định dạng model    | Keras (`.keras`)                                |

## Cài đặt

### Yêu cầu hệ thống

- Python **3.9+**
- Khuyến nghị: RAM ≥ 8 GB (vì load nhiều model cùng lúc)
- GPU tùy chọn (giúp tăng tốc inference)

### Các bước

```bash
# 1. Clone repository
git clone https://github.com/VzTong/LungDx.git
cd LungDx

# 2. Tạo và kích hoạt môi trường ảo
python -m venv venv

# Windows
venv\Scripts\activate

# Linux / macOS
source venv/bin/activate

# 3. Cài đặt dependencies
pip install -r requirements.txt
```

### Chuẩn bị model

Tạo thư mục `model/` và đặt các file trọng số đã huấn luyện với **đúng tên**:

```
model/
├── lung_cnn_model_v0.keras
├── lung_resnet50_model_v1.keras
├── lung_mobilenetv2_model_v1.keras
└── lung_efficientnetb0_model_v1.keras
```

Lần đầu chạy, ứng dụng sẽ tự động chuyển đổi mỗi model sang phiên bản `_converted.keras` nếu chưa có.

## Sử dụng

```bash
python app.py
```

Mở trình duyệt và truy cập:

```
http://localhost:5000
```

| Route       | Mô tả                      |
|-------------|----------------------------|
| `/`         | Trang chẩn đoán chính      |
| `/history`  | Lịch sử chẩn đoán          |

## Tài liệu API

| Method   | Endpoint                      | Mô tả                                    |
|----------|-------------------------------|------------------------------------------|
| `GET`    | `/`                           | Hiển thị trang chẩn đoán                 |
| `GET`    | `/history`                    | Hiển thị trang lịch sử                   |
| `POST`   | `/analyze`                    | Phân tích ảnh upload hoặc URL            |
| `GET`    | `/model_status`               | Trả về trạng thái load của từng model    |
| `DELETE` | `/delete_history/<index>`     | Xóa một bản ghi lịch sử theo index       |

### Sự kiện Socket.IO

| Event       | Chiều           | Ví dụ payload                            |
|-------------|-----------------|------------------------------------------|
| `progress`  | Server → Client | `{ "percentage": 75 }`                   |
| `result`    | Server → Client | Đối tượng kết quả phân tích đầy đủ       |
| `error`     | Server → Client | `{ "message": "..." }`                   |
| `cancel`    | Client → Server | Hủy phân tích đang chạy                  |
| `connected` | Server → Client | `{ "sid": "..." }`                       |

## Cấu trúc dự án

```
LungDx/
├── app.py                              # Ứng dụng chính Flask + SocketIO
├── model/                              # Đặt file .keras vào đây (không commit)
├── static/
│   ├── Architecture/                   # Sơ đồ kiến trúc mô hình
│   ├── ConfusionMatrix/                # Ảnh confusion matrix
│   ├── TrainingPlots/                  # Biểu đồ train / validation
│   ├── Uploads/                        # Ảnh người dùng upload (runtime)
│   ├── script.js                       # Logic frontend
│   ├── style.css                       # Stylesheet
│   └── model_training_version_comparison_hitory.json
├── templates/
│   ├── base.html
│   ├── index.html
│   └── history.html
├── history.json                        # Lịch sử chẩn đoán (runtime)
├── app.log                             # File log (runtime)
├── requirements.txt
├── .gitignore
└── README.md
```

## Lưu ý bảo mật

Hiện tại `SECRET_KEY` đang được hard-code:

```python
app.config['SECRET_KEY'] = 'your-secret-key'
```

**Khuyến nghị** khi triển khai thực tế:

```python
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-change-me')
```

Đảm bảo **không commit** các thành phần sau (đã được ignore trong `.gitignore`):

- Thư mục `model/` và các file `*.keras`
- `history.json`, `app.log`
- `static/Uploads/`
- File `.env` chứa secret

## Tác giả

**VzTong**
GitHub: [https://github.com/VzTong](https://github.com/VzTong)

## Giấy phép

Dự án này được cấp phép theo **MIT License** – xem file [LICENSE](LICENSE) để biết thêm chi tiết.

