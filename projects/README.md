# 🏨 BookingHotels - Hệ Thống Đặt Phòng Khách Sạn

<p align="center">
  <img src="https://img.shields.io/badge/.NET-8.0-512BD4?style=flat-square&logo=dotnet&logoColor=white" alt=".NET 8"/>
  <img src="https://img.shields.io/badge/ASP.NET%20Core-MVC-512BD4?style=flat-square&logo=dotnet&logoColor=white" alt="ASP.NET Core"/>
  <img src="https://img.shields.io/badge/Entity%20Framework%20Core-CC2927?style=flat-square&logo=microsoftsqlserver&logoColor=white" alt="EF Core"/>
  <img src="https://img.shields.io/badge/Bootstrap-5-7952B3?style=flat-square&logo=bootstrap&logoColor=white" alt="Bootstrap"/>
  <img src="https://img.shields.io/badge/AdminLTE-3-3C8DBC?style=flat-square" alt="AdminLTE"/>
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License"/>
</p>

*"Một project khiêm tốn nhưng đầy tự hào của dev nghiệp dư nhưng có chí hướng thượng" 😄*

---

## 🇻🇳 Tiếng Việt

### 📖 Giới Thiệu

Chào mừng đến với **BookingHotels** - một hệ thống đặt phòng khách sạn được xây dựng bằng ASP.NET Core MVC với niềm đam mê và... một chút cafe ☕. Đây không phải là Booking.com thế hệ mới đâu nhé, chỉ là một project sinh viên được làm với tình yêu thương và sự cần cù của đôi bàn tay non trẻ 😊.

### 🎯 Tính Năng Chính

#### 👥 Dành cho Khách Hàng:
- **🔐 Đăng ký/Đăng nhập**: Tạo tài khoản và đăng nhập với bảo mật
- **🔍 Tìm kiếm phòng**: Tìm phòng theo ngày, số người, loại phòng, giá
- **🏠 Xem chi tiết phòng**: Hình ảnh, mô tả, thiết bị, tiện nghi
- **📅 Đặt phòng**: Booking phòng với thông tin đầy đủ
- **📋 Quản lý đặt phòng**: Xem lịch sử booking, chi tiết đơn hàng
- **❌ Hủy đặt phòng**: Hủy booking với các điều kiện
- **⭐ Đánh giá & Comment**: Viết review, đánh giá khách sạn
- **📰 Xem tin tức**: Đọc tin tức du lịch, khuyến mãi
- **👤 Quản lý profile**: Cập nhật thông tin cá nhân, đổi mật khẩu

#### 🔧 Dành cho Admin:

**🏨 Quản Lý Khách Sạn:**
- **CRUD Hotels**: Thêm, sửa, xóa thông tin khách sạn
- **CRUD Branches**: Quản lý chi nhánh khách sạn
- **Upload Images**: Quản lý hình ảnh khách sạn

**🛏️ Quản Lý Phòng:**
- **CRUD Rooms**: Quản lý phòng (tên, giá, mô tả)
- **CRUD Room Types**: Quản lý loại phòng
- **CRUD Equipment**: Quản lý thiết bị, tiện nghi
- **CRUD Equipment Types**: Phân loại thiết bị
- **Room-Equipment Mapping**: Gán thiết bị cho phòng

**📦 Quản Lý Đơn Hàng:**
- **View Orders**: Xem tất cả đơn đặt phòng
- **Order Processing**: Xử lý, xác nhận đơn hàng
- **Order Details**: Xem chi tiết từng booking
- **Cancel Orders**: Hủy đơn hàng với lý do

**👥 Quản Lý Người Dùng:**
- **CRUD Users**: Quản lý tài khoản người dùng
- **Role Management**: Phân quyền theo vai trò
- **Permission Control**: Kiểm soát quyền truy cập
- **User Analytics**: Thống kê người dùng

**📰 Quản Lý Tin Tức:**
- **CRUD News**: Đăng, sửa, xóa tin tức
- **News Categories**: Quản lý danh mục tin tức
- **Content Management**: Quản lý nội dung bài viết

**💬 Quản Lý Comment:**
- **View Comments**: Xem tất cả đánh giá
- **Moderate Comments**: Duyệt, xóa comment
- **Response Management**: Trả lời đánh giá

**📊 Báo Cáo & Thống Kê:**
- **Revenue Reports**: Báo cáo doanh thu
- **Booking Statistics**: Thống kê đặt phòng

### 🏗️ Kiến Trúc & Công Nghệ

#### 📂 Cấu Trúc Project (3-Layer Architecture):

```
📁 BookingHotels/
├── 🗃️ App.Data/          # Data Access Layer
│   ├── Entities/         # Domain Models
│   ├── Configurations/   # EF Configurations
│   ├── Repositories/     # Repository Pattern
│   ├── DataSeeders/      # Sample Data
│   └── Migrations/       # EF Migrations
├── 🔧 App.Share/         # Shared Components
│   ├── Attributes/       # Custom Validation
│   ├── Extensions/       # Helper Methods
│   └── Consts/           # Constants
└── 🌐 App.Web/           # Presentation Layer
    ├── Areas/Admin/      # Admin Panel
    ├── Controllers/      # MVC Controllers
    ├── Views/            # Razor Views
    ├── ViewModels/       # Data Transfer Objects
    ├── Services/         # Business Logic
    └── wwwroot/          # Static Files
```

#### 💻 Stack Công Nghệ (chi tiết hơn):

**Backend:**
| Công nghệ                       | Vai trò                                      |
|--------------------------------|----------------------------------------------|
| **.NET 8.0**                   | Framework chính                              |
| **ASP.NET Core MVC**           | Web framework, routing, middleware           |
| **Entity Framework Core**      | ORM, Code-First, Migrations                  |
| **SQL Server / LocalDB**       | Database chính                               |
| **AutoMapper**                 | Object mapping (Entity ↔ ViewModel)          |
| **Repository Pattern**         | Tách biệt Data Access, dễ test & bảo trì     |
| **Cookie Authentication**      | Đăng nhập bảo mật                            |
| **Role-based Authorization**   | Phân quyền theo vai trò (Admin / User)       |
| **Soft Delete + Audit Trail**  | Xóa mềm + theo dõi Created/Updated/Deleted  |
| **Data Seeding**               | Tự động tạo dữ liệu mẫu khi migrate          |
| **Custom Validation Attributes** | Validate form theo rule riêng              |
| **Extension Methods**          | Helper methods tiện ích                      |

**Frontend:**
| Công nghệ           | Vai trò                                      |
|---------------------|----------------------------------------------|
| **Razor Views**     | Server-side rendering                        |
| **Bootstrap 5**     | CSS framework, responsive layout             |
| **AdminLTE 3**      | Giao diện Admin chuyên nghiệp                |
| **jQuery**          | Xử lý DOM, AJAX                              |
| **toastr / Notyf**  | Thông báo (toast notification)               |

### 🛠️ Cài Đặt & Chạy Project

#### 📋 Yêu Cầu Hệ Thống:
- **Windows 10/11** (hoặc macOS/Linux nếu bạn thích phiêu lưu)
- **.NET 8.0 SDK** – [Tải về](https://dotnet.microsoft.com/download)
- **SQL Server 2019+** hoặc **SQL Server LocalDB**
- **Visual Studio 2022** hoặc **VS Code** (khuyến nghị VS 2022)

#### 🚀 Các Bước Cài Đặt:

1. **Clone Repository:**
```bash
git clone https://github.com/VzTong/BookingHotels.git
cd BookingHotels
```

2. **Cấu Hình Database:**
   Mở `App.Web/appsettings.json` và sửa connection string:
```json
"ConnectionStrings": {
  "Database": "Server=TÊN_SERVER;Database=BookingHotelPJ;Trusted_Connection=True;Encrypt=false;"
}
```

3. **Restore NuGet Packages:**
```bash
dotnet restore
```

4. **Tạo Database & Migration:**
```bash
cd App.Data
dotnet ef database update
```
*Database sẽ tự động tạo với sample data nhé!*

5. **Chạy Application:**
```bash
cd ../App.Web
dotnet run
```
Hoặc nhấn **F5** trong Visual Studio.

6. **Truy Cập Ứng Dụng:**
   - **Client:** https://localhost:5001
   - **Admin:** https://localhost:5001/Admin
   - **Admin Login:** `admin@hotel.com` / `123456`

#### ⚙️ Cấu Hình Tùy Chọn:

**Email Service (Đã chuẩn bị sẵn - chưa active):**
```json
"Mail": {
  "Email": "your-email@gmail.com",
  "Password": "your-app-password",
  "SmtpServer": "smtp.gmail.com",
  "Port": 465,
  "Signature": "Được gửi từ BookingHotels System"
}
```
*Lưu ý: Cần implement thêm logic gửi mail trong controllers.*

### 👥 Đội Ngũ Phát Triển

- **🚀 VzTong** - *Team Lead & Backend Developer*
  - Phụ trách architecture, database design, business logic
  - Hỗ trợ frontend development cho team member

- **💻 nhuy456** - *Frontend Developer*
  - Phụ trách UI/UX cho phần User Interface
  - Tạo nên những trải nghiệm người dùng mượt mà

### 🎨 Special Thanks
- **Admin Template**: Sử dụng AdminLTE 3.0 - một template tuyệt vời
- **Mentor**: Cảm ơn những người thầy đã hướng dẫn và chia sẻ kinh nghiệm quý báu

### 📄 Giấy phép

Dự án này được cấp phép theo **MIT License** – xem file [LICENSE](LICENSE) để biết thêm chi tiết.

### 📞 Liên Hệ
- **Team Lead & Backend Developer**: VzTong
- **Frontend Dev**: nhuy456
- **Repository**: [BookingHotels](https://github.com/VzTong/BookingHotels)
- **Issues**: [Report bugs here](https://github.com/VzTong/BookingHotels/issues)

---

## 🇺🇸 English

### 📖 Introduction

Welcome to **BookingHotels** - a hotel booking system built with ASP.NET Core MVC with passion and... a little bit of coffee ☕. This isn't the next-gen Booking.com, just a student project made with love and the diligence of young, eager hands 😊.

### 🎯 Key Features

#### 👥 For Customers:
- **🔐 Registration/Login**: Create account and secure login
- **🔍 Room Search**: Find rooms by date, guests, room type, price
- **🏠 Room Details**: View images, descriptions, equipment, amenities
- **📅 Room Booking**: Book rooms with complete information
- **📋 Booking Management**: View booking history, order details
- **❌ Cancel Booking**: Cancel bookings with conditions
- **⭐ Reviews & Comments**: Write reviews, rate hotels
- **📰 News Reading**: Browse travel news and promotions
- **👤 Profile Management**: Update personal info, change password

#### 🔧 For Admins:

**🏨 Hotel Management:**
- **CRUD Hotels**: Add, edit, delete hotel information
- **CRUD Branches**: Manage hotel branches
- **Upload Images**: Manage hotel images

**🛏️ Room Management:**
- **CRUD Rooms**: Manage rooms (name, price, description)
- **CRUD Room Types**: Manage room types
- **CRUD Equipment**: Manage equipment and amenities
- **CRUD Equipment Types**: Categorize equipment
- **Room-Equipment Mapping**: Assign equipment to rooms

**📦 Order Management:**
- **View Orders**: View all booking orders
- **Order Processing**: Process and confirm orders
- **Order Details**: View detailed booking information
- **Cancel Orders**: Cancel orders with reasons

**👥 User Management:**
- **CRUD Users**: Manage user accounts
- **Role Management**: Assign roles and permissions
- **Permission Control**: Access control management
- **User Analytics**: User statistics

**📰 News Management:**
- **CRUD News**: Create, edit, delete news
- **News Categories**: Manage news categories
- **Content Management**: Manage article content

**💬 Comment Management:**
- **View Comments**: View all reviews
- **Moderate Comments**: Approve / delete comments
- **Response Management**: Reply to reviews

**📊 Reports & Statistics:**
- **Revenue Reports**: Revenue reports
- **Booking Statistics**: Booking statistics

### 🏗️ Architecture & Technology

#### 📂 Project Structure (3-Layer Architecture):

```
📁 BookingHotels/
├── 🗃️ App.Data/          # Data Access Layer
│   ├── Entities/         # Domain Models
│   ├── Configurations/   # EF Configurations
│   ├── Repositories/     # Repository Pattern
│   ├── DataSeeders/      # Sample Data
│   └── Migrations/       # EF Migrations
├── 🔧 App.Share/         # Shared Components
│   ├── Attributes/       # Custom Validation
│   ├── Extensions/       # Helper Methods
│   └── Consts/           # Constants
└── 🌐 App.Web/           # Presentation Layer
    ├── Areas/Admin/      # Admin Panel
    ├── Controllers/      # MVC Controllers
    ├── Views/            # Razor Views
    ├── ViewModels/       # Data Transfer Objects
    ├── Services/         # Business Logic
    └── wwwroot/          # Static Files
```

#### 💻 Technology Stack (more detailed):

**Backend:**
| Technology                      | Role                                           |
|--------------------------------|------------------------------------------------|
| **.NET 8.0**                   | Main framework                                 |
| **ASP.NET Core MVC**           | Web framework, routing, middleware             |
| **Entity Framework Core**      | ORM, Code-First, Migrations                    |
| **SQL Server / LocalDB**       | Primary database                               |
| **AutoMapper**                 | Object mapping (Entity ↔ ViewModel)            |
| **Repository Pattern**         | Decoupled data access, easier testing & maintenance |
| **Cookie Authentication**      | Secure login                                   |
| **Role-based Authorization**   | Role-based access control (Admin / User)       |
| **Soft Delete + Audit Trail**  | Soft delete + Created/Updated/Deleted tracking |
| **Data Seeding**               | Automatically seed sample data on migrate      |
| **Custom Validation Attributes**| Custom form validation rules                 |
| **Extension Methods**          | Utility helper methods                         |

**Frontend:**
| Technology          | Role                                           |
|---------------------|------------------------------------------------|
| **Razor Views**     | Server-side rendering                          |
| **Bootstrap 5**     | CSS framework, responsive layout               |
| **AdminLTE 3**      | Professional admin dashboard                   |
| **jQuery**          | DOM manipulation, AJAX                         |
| **toastr / Notyf**  | Toast notifications                            |

### 🛠️ Installation & Running

#### 📋 System Requirements:
- **Windows 10/11** (or macOS/Linux if you like adventure)
- **.NET 8.0 SDK** – [Download](https://dotnet.microsoft.com/download)
- **SQL Server 2019+** or **SQL Server LocalDB**
- **Visual Studio 2022** or **VS Code** (VS 2022 recommended)

#### 🚀 Installation Steps:

1. **Clone Repository:**
```bash
git clone https://github.com/VzTong/BookingHotels.git
cd BookingHotels
```

2. **Configure Database:**
   Open `App.Web/appsettings.json` and update the connection string:
```json
"ConnectionStrings": {
  "Database": "Server=YOUR_SERVER;Database=BookingHotelPJ;Trusted_Connection=True;Encrypt=false;"
}
```

3. **Restore NuGet Packages:**
```bash
dotnet restore
```

4. **Create Database & Migration:**
```bash
cd App.Data
dotnet ef database update
```
*The database will be automatically created with sample data!*

5. **Run the Application:**
```bash
cd ../App.Web
dotnet run
```
Or just press **F5** in Visual Studio.

6. **Access the Application:**
   - **Client:** https://localhost:5001
   - **Admin:** https://localhost:5001/Admin
   - **Admin Login:** `admin@hotel.com` / `123456`

#### ⚙️ Optional Configuration:

**Email Service (Prepared but not yet activated):**
```json
"Mail": {
  "Email": "your-email@gmail.com",
  "Password": "your-app-password",
  "SmtpServer": "smtp.gmail.com",
  "Port": 465,
  "Signature": "Sent from BookingHotels System"
}
```
*Note: You still need to implement the actual sending logic in the controllers.*

### 👥 Development Team

- **🚀 VzTong** - *Team Lead & Backend Developer*
  - Responsible for architecture, database design, business logic
  - Supporting frontend development for team member

- **💻 nhuy456** - *Frontend Developer*
  - Responsible for User Interface UI/UX
  - Creating smooth user experiences

### 🎨 Special Thanks
- **Admin Template**: Using AdminLTE 3.0 - an amazing template
- **Mentors**: Thanks to the teachers who guided and shared valuable experiences

### 📄 License

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.

### 📞 Contact
- **Team Lead & Backend Developer**: VzTong
- **Frontend Dev**: nhuy456
- **Repository**: [BookingHotels](https://github.com/VzTong/BookingHotels)
- **Issues**: [Report bugs here](https://github.com/VzTong/BookingHotels/issues)

---

<div align="center">

**⭐ Nếu project này hữu ích, đừng quên cho một star nhé! / If this project is helpful, don't forget to give it a star!**

*"Code như cuộc sống - không hoàn hảo nhưng đầy hy vọng!" 🌟*

</div>