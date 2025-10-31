# Dự Án Quản Lý Sản Phẩm

## Thành viên
- Trần Nguyễn Phương Anh: Frontend
- Nguyễn Thanh Sơn: Backend
- Hồ Vủ Minh Tài: Database

## Giới thiệu
Dự án **Quản Lý Sản Phẩm** là ứng dụng web cho phép người dùng thực hiện các thao tác **CRUD (Create – Read – Update – Delete)** trên danh sách sản phẩm.  
Ứng dụng giúp quản lý dữ liệu dễ dàng, thao tác nhanh và hỗ trợ giao diện thân thiện.

## Công nghệ sử dụng
### Backend
- **Node.js (Express.js)** — Xây dựng RESTful API
- **MongoDB** — Lưu trữ dữ liệu
- **Mongoose** — ORM cho MongoDB
- **JWT Authentication** — Bảo mật người dùng

### Frontend
- **ReactJS** — Giao diện người dùng
- **Axios** — Kết nối API
- **TailwindCSS** — Giao diện nhanh, hiện đại

### Khác
- **Git / GitHub** — Quản lý mã nguồn
- **Postman** — Kiểm thử API
- **Docker** *(tùy chọn)* — Triển khai môi trường độc lập

## Cấu trúc dự án
```
project/
├── backend/
│ ├── src/
│ │ ├── controllers/
│ │ ├── models/
│ │ ├── routes/
│ │ └── server.js
│ └── package.json
├── frontend/
│ ├── src/
│ ├── public/
│ └── package.json
└── README.md
```

## Cài đặt và chạy dự án

### Cách 1: Chạy tự động (Khuyến nghị)
```bash
# Cài đặt tất cả dependencies
npm run install-all

# Chạy cả backend và frontend cùng lúc
npm start
```

### Cách 2: Chạy thủ công

#### Backend (Port 5000)
```bash
cd backend
npm install
npm start
```

#### Frontend (Port 3000)
```bash
cd frontend
npm install
npm start
```

## Truy cập ứng dụng
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints
- GET /users - Lấy danh sách users
- POST /users - Tạo user mới
- PUT /users/:id - Cập nhật user
- DELETE /users/:id - Xóa user

## Tính năng
- ✅ Thêm user mới
- ✅ Hiển thị danh sách users
- ✅ Sửa thông tin user
- ✅ Xóa user
- ✅ Validation form
- ✅ Responsive design