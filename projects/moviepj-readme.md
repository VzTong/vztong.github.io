# 🎬 MoviePJ - Movie Management System

<p align="center">
  <img src="https://img.shields.io/badge/.NET-8.0-512BD4?style=flat-square&logo=dotnet&logoColor=white" alt=".NET 8"/>
  <img src="https://img.shields.io/badge/ASP.NET%20Core-MVC-512BD4?style=flat-square&logo=dotnet&logoColor=white" alt="ASP.NET Core"/>
  <img src="https://img.shields.io/badge/Entity%20Framework%20Core-CC2927?style=flat-square&logo=microsoftsqlserver&logoColor=white" alt="EF Core"/>
  <img src="https://img.shields.io/badge/Bootstrap-5-7952B3?style=flat-square&logo=bootstrap&logoColor=white" alt="Bootstrap"/>
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License"/>
</p>

*A simple yet functional movie database for learning and practice*

---

## 🌟 English Version

### 🎭 What's This Project?

**MoviePJ** is a cinema management system designed for movie enthusiasts! 🍿

From tracking your favorite film collections to managing detailed information about actors and directors - this is the perfect learning project to explore the ASP.NET Core universe. More than just basic CRUD, it's a complete entertainment content management ecosystem! ✨

### 🚀 Features

#### 🎯 System's Heart & Soul
- **🎬 Movie & Anime Management**: From Hollywood blockbusters to Japanese anime - we've got them all!
- **👥 User System**: Registration, role management, and movie lovers community
- **🎭 A-List Stars Database**: Store actor & director info like a mini IMDb
- **🏢 Studio Hub**: From Marvel Studios to Studio Ghibli - track who made what
- **📂 Smart Classification**: Action, Romance, Horror... each genre in its place
- **📺 Episode Tracker**: Follow every episode, never miss a thing!
- **💬 Discussion Corner**: Share thoughts, debate about trending movies
- **🔍 Lightning Search**: Find movies faster than Google, filter as you wish

#### 🛡️ Security & Authorization
- **🔐 Cookie Authentication**: Secure login with protected sessions
- **👑 Multi-layer Authorization**: Admin and user roles with appropriate permissions
- **🔒 Permission System**: Detailed control over system functions

#### 📱 User Experience Delights
- **📄 Smart Pagination**: Navigate through content like a breeze
- **🔔 Toast Notifications**: Friendly feedback messages that users actually like
- **📊 Admin Dashboard**: Statistics overview that makes sense
- **🎨 Bootstrap Beauty**: Clean, responsive design that works everywhere

### 🏗️ Architecture

#### 🧱 Project Structure
Built with **MVC pattern** for clear organization:

```
📦 MoviePJ
├── 🎯 Controllers/          # Handle HTTP requests
├── 📄 Views/               # User interface templates
├── 🗃️ Entities/            # Data models and database context
├── ⚙️ Configurations/      # Entity Framework configurations
├── 🌱 DataSeeders/         # Initial data setup
├── 🔧 Extensions/          # Helper methods
├── 🔐 Common/              # Authorization components
└── 🌍 Areas/Admin/         # Admin functionality
```

#### 🛠️ Tech Stack (detailed)

**Backend:**
| Technology                        | Role                                              |
|-----------------------------------|---------------------------------------------------|
| **ASP.NET Core 8.0**              | Main framework                                    |
| **Entity Framework Core 8.0**     | ORM, Code-First, Migrations                       |
| **SQL Server / LocalDB**          | Primary database                                  |
| **Cookie Authentication**         | Secure login with protected sessions              |
| **Role-based Authorization**      | Multi-layer permission (Admin / User)             |
| **Soft Delete + Audit Trail**     | Data preservation + Created/Updated tracking      |
| **BCrypt.Net-Next**               | Password hashing                                  |
| **X.PagedList**                   | Pagination support                                |
| **AspNetCoreHero.ToastNotification** | Toast notifications                            |

**Frontend:**
| Technology          | Role                                              |
|---------------------|---------------------------------------------------|
| **Razor Views**     | Server-side rendering                             |
| **Bootstrap 5**     | Responsive UI framework                           |
| **jQuery**          | DOM manipulation & AJAX                           |

### 🎯 CRUD Operations Breakdown

#### 🎬 Film Management
- **Create**: Add new movies with all metadata (genres, actors, studios, etc.)
- **Read**: Browse, search, and filter movies by various criteria
- **Update**: Edit movie details, cast, and associations
- **Delete**: Soft delete with data integrity preservation

#### 👤 User Management
- **Create**: Register new users with role assignment
- **Read**: View user lists with pagination and filtering
- **Update**: Edit profiles, change roles, block/unblock users
- **Delete**: Soft delete user accounts

#### 🎭 Content Management (Actors, Studios, Makers, Genres)
- **Standardized CRUD**: All entities follow consistent patterns
- **Relationship Management**: Handle complex many-to-many relationships
- **File Upload**: Image handling for actors, studios, etc.

### 🗃️ Database Design

The database follows a **well-structured relational design** with:
- **🔗 Junction Tables**: For many-to-many relationships (FilmActor, FilmGenres, etc.)
- **🗃️ Soft Deletes**: Data preservation with `DeletedDate` pattern
- **📊 Audit Trail**: Track creation and modification dates
- **⚙️ Entity Configurations**: Detailed EF configurations for each entity
- **🌱 Data Seeders**: Comprehensive initial data population
- **🔧 Complex Relationships**: Movies linked to actors, genres, studios, episodes

### 🚀 Installation & Setup

#### 📋 Prerequisites
- .NET 8.0 SDK or later
- SQL Server (LocalDB works fine)
- Visual Studio 2022 or VS Code
- Basic C# and Entity Framework knowledge

#### 🛠️ Step-by-Step Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/VzTong/DACS1.git
   cd DACS1/MoviePJ
   ```

2. **Configure Database Connection**
   - Open `appsettings.json`
   - Update the connection string:
   ```json
   {
     "ConnectionStrings": {
       "Database": "Your_SQL_Server_Connection_String_Here"
     }
   }
   ```

3. **Install Dependencies**
   ```bash
   dotnet restore
   ```

4. **Create & Seed Database**
   ```bash
   dotnet ef database update
   ```
   *This creates tables and adds some initial data* 🌱

5. **Run the Application**
   ```bash
   dotnet run
   ```

6. **Access the Application**
   - **User Site**: `http://localhost:5000`
   - **Admin Panel**: `http://localhost:5000/admin`
   - **Default Admin**: Username: `admin` | Password: `123456`

### 🎮 Usage Guide

#### 👤 For Regular Users
- Browse movies by genre (Movie/Anime)
- Search and filter content
- View movie details and episodes
- Leave comments and reviews

#### 👑 For Administrators
- Complete CRUD operations on all entities
- User management and role assignment
- Content moderation and approval
- View dashboard statistics

### 🎨 Project Highlights

#### 🏆 Learning Outcomes
- **Clean Code**: Well-organized project structure
- **ASP.NET Core Patterns**: Current development practices
- **Database Design**: Entity Framework relationships and configurations
- **Data Seeding**: Comprehensive initial data setup
- **User Interface**: Responsive web design
- **Security**: Authentication and authorization implementation

### 📄 License

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.

### 👨‍💻 Author

**VzTong**  
GitHub: [https://github.com/VzTong](https://github.com/VzTong)  
Project: DACS1 - MoviePJ (Đồ án cơ sở 1)

---

## 🌟 Phiên bản Tiếng Việt

### 🎭 Dự Án Là Gì?

**MoviePJ** là một hệ thống quản lý phim ảnh được thiết kế cho những ai yêu thích cinema! 🍿

Từ việc theo dõi bộ sưu tập phim yêu thích đến quản lý thông tin chi tiết về diễn viên, đạo diễn - đây là dự án học tập hoàn hảo để khám phá thế giới ASP.NET Core. Không chỉ là CRUD đơn thuần, mà còn là cả một ecosystem quản lý nội dung giải trí! ✨

### 🚀 Những Tính Năng Chính

#### 🎯 Trái Tim Của Hệ Thống
- **🎬 Quản Lý Phim & Anime**: Từ Hollywood blockbuster đến anime Nhật Bản - tất cả đều có mặt!
- **👥 Hệ Thống User**: Đăng ký, phân quyền, và quản lý cộng đồng movie lovers
- **🎭 Database Sao Hạng A**: Lưu trữ thông tin diễn viên, đạo diễn như một IMDb mini
- **🏢 Studio Center**: Từ Marvel Studios đến Studio Ghibli - ai làm phim gì đều rõ
- **📂 Phân Loại Thông Minh**: Action, Romance, Horror... mỗi thể loại một chỗ
- **📺 Episode Tracker**: Theo dõi từng tập phim, chẳng bỏ lỡ gì cả!
- **💬 Góc Thảo Luận**: Chia sẻ cảm nhận, tranh luận về phim hot
- **🔍 Tìm Kiếm Siêu Tốc**: Tìm phim nhanh hơn Google, lọc theo ý thích

#### 🛡️ Bảo Mật & Phân Quyền
- **🔐 Cookie Authentication**: Đăng nhập an toàn, session được bảo vệ kỹ lưỡng
- **👑 Phân Quyền Nhiều Tầng**: Admin toàn quyền, User giới hạn - ai làm gì, có quyền đó
- **🔒 Hệ Thống Phân Quyền**: Kiểm soát chi tiết từng chức năng, đảm bảo bảo mật

#### 📱 Trải Nghiệm Người Dùng
- **📄 Phân trang thông minh**: Duyệt nội dung siêu mượt
- **🔔 Toast Notifications**: Thông báo thân thiện, dễ chịu
- **📊 Admin Dashboard**: Thống kê tổng quan dễ hiểu
- **🎨 Bootstrap Beauty**: Giao diện sạch sẽ, responsive mọi thiết bị

### 🏗️ "Kiến Trúc Sư" Của Dự Án

#### 🧱 Blueprint Tổng Thể
Dự án được xây dựng theo mô hình **MVC** - như một tòa nhà có foundation vững chắc:

```
🏗️ MoviePJ Architecture
├── 🎯 Controllers/          # "Điều hành viên" - xử lý requests
├── 📄 Views/               # "Gương mặt" - UI đẹp mắt cho users
├── 🗃️ Entities/            # "Trái tim" - dữ liệu và database
├── ⚙️ Configurations/      # "Kỹ sư" - thiết lập EF chi tiết
├── 🌱 DataSeeders/         # "Người gieo hạt" - data khởi tạo
├── 🔧 Extensions/          # "Hộp công cụ" - helper methods
├── 🔐 Common/              # "Bộ phận bảo vệ" - authorization
└── 🌍 Areas/Admin/         # "Phòng VIP" - khu vực admin
```

#### 🛠️ Công Nghệ Sử Dụng (chi tiết hơn)

**Backend:**
| Công nghệ                         | Vai trò                                           |
|-----------------------------------|---------------------------------------------------|
| **ASP.NET Core 8.0**              | Framework chính                                   |
| **Entity Framework Core 8.0**     | ORM, Code-First, Migrations                       |
| **SQL Server / LocalDB**          | Cơ sở dữ liệu chính                               |
| **Cookie Authentication**         | Đăng nhập bảo mật                                 |
| **Role-based Authorization**      | Phân quyền nhiều tầng (Admin / User)              |
| **Soft Delete + Audit Trail**     | Xóa mềm + theo dõi Created/Updated                |
| **BCrypt.Net-Next**               | Mã hóa mật khẩu                                   |
| **X.PagedList**                   | Hỗ trợ phân trang                                 |
| **AspNetCoreHero.ToastNotification** | Thông báo toast                                |

**Frontend:**
| Công nghệ           | Vai trò                                           |
|---------------------|---------------------------------------------------|
| **Razor Views**     | Server-side rendering                             |
| **Bootstrap 5**     | Framework UI responsive                           |
| **jQuery**          | Xử lý DOM & AJAX                                  |

### 🎯 Các Thao Tác CRUD

#### 🎬 Quản Lý Phim Ảnh
- **✨ Tạo Mới**: Thêm phim với đầy đủ thông tin - từ poster đến trailer
- **👀 Xem & Tìm**: Duyệt phim theo thể loại, năm, studio theo ý muốn
- **✏️ Chỉnh Sửa**: Cập nhật thông tin, thêm diễn viên, sửa thể loại dễ dàng
- **🗑️ Xóa Thông Minh**: Xóa mềm - xóa mà không mất dữ liệu vĩnh viễn

#### 👤 Quản Lý Người Dùng
- **🆕 Đăng Ký**: Tạo tài khoản mới với phân quyền phù hợp
- **📋 Danh Sách**: Xem danh sách người dùng với phân trang
- **🔄 Cập Nhật**: Đổi vai trò, khóa/mở khóa, chỉnh sửa hồ sơ
- **⚰️ Xóa An Toàn**: Xóa mềm để bảo vệ dữ liệu lịch sử

### 🚀 Cài Đặt & Thiết Lập

#### 📋 Yêu Cầu Hệ Thống
- .NET 8.0 SDK trở lên
- SQL Server (LocalDB cũng được!)
- Visual Studio 2022 hoặc VS Code
- Hiểu biết cơ bản về C# và Entity Framework

#### 🛠️ Hướng Dẫn Cài Đặt Chi Tiết

1. **Clone Repository**
   ```bash
   git clone https://github.com/VzTong/DACS1.git
   cd DACS1/MoviePJ
   ```

2. **Cấu Hình Kết Nối Database**
   - Mở file `appsettings.json`
   - Cập nhật connection string:
   ```json
   {
     "ConnectionStrings": {
       "Database": "Connection_String_SQL_Server_Của_Bạn"
     }
   }
   ```

3. **Cài Đặt Dependencies**
   ```bash
   dotnet restore
   ```

4. **Tạo & Seed Database**
   ```bash
   dotnet ef database update
   ```
   *Lệnh này tự động tạo bảng và điền dữ liệu ban đầu* 🌱

5. **Chạy Ứng Dụng**
   ```bash
   dotnet run
   ```

6. **Truy Cập Ứng Dụng**
   - **Trang User**: `http://localhost:5000`
   - **Admin Panel**: `http://localhost:5000/admin`
   - **Tài Khoản Admin Mặc Định**: Username: `admin` | Password: `123456`

### 🎮 Hướng Dẫn Sử Dụng

#### 👤 Đối Với Người Dùng Thông Thường
- Duyệt phim theo thể loại (Movie/Anime)
- Tìm kiếm và lọc nội dung
- Xem chi tiết phim và tập phim
- Để lại bình luận và đánh giá

#### 👑 Đối Với Quản Trị Viên
- Thực hiện đầy đủ các thao tác CRUD trên tất cả entities
- Quản lý người dùng và phân quyền
- Kiểm duyệt và phê duyệt nội dung
- Xem thống kê dashboard

### 🎨 Tại Sao Dự Án Này "Đáng Đồng Tiền Bát Gạo"?

#### 🏆 Những Bài Học Vàng
- **🧹 Clean Code**: Cấu trúc project gọn gàng, dễ maintain như một cuốn sách hay
- **🔥 ASP.NET Core Patterns**: Học được các pattern hiện đại, không lỗi thời
- **🏗️ Database Design**: Hiểu rõ relationships, configurations như một DBA junior
- **🌱 Data Seeding**: Biết cách tạo dữ liệu mẫu professional
- **🎨 Responsive UI**: Giao diện đẹp với template được tùy chỉnh
- **🛡️ Security Implementation**: Bảo mật thực tế, không chỉ lý thuyết suông

### 📄 Giấy phép

Dự án này được cấp phép theo **MIT License** – xem file [LICENSE](LICENSE) để biết thêm chi tiết.

### 👨‍💻 Tác giả

**VzTong**  
GitHub: [https://github.com/VzTong](https://github.com/VzTong)  
Project: DACS1 - MoviePJ (Đồ án cơ sở 1)

---

*Made with ❤️ and lots of ☕ by VzTong*

> "The best way to learn programming is by building projects."  
> *Hope this project helps someone learn!* 🍿
