# Hướng dẫn test API Authentication với Postman

## Cấu hình cơ bản
- **Base URL**: `http://localhost:3000`
- **Content-Type**: `application/json`

## 1. Test API Signup (Đăng ký)

### Endpoint: POST `/api/auth/signup`

**Request Body:**
```json
{
  "name": "Nguyễn Văn A",
  "email": "test@example.com",
  "password": "123456",
  "role": "user"
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "Đăng ký thành công",
  "data": {
    "user": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "Nguyễn Văn A",
      "email": "test@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Test Cases:**
1. ✅ Đăng ký thành công với thông tin hợp lệ
2. ❌ Đăng ký với email đã tồn tại (400)
3. ❌ Đăng ký với mật khẩu quá ngắn (400)
4. ❌ Đăng ký thiếu thông tin bắt buộc (400)

## 2. Test API Login (Đăng nhập)

### Endpoint: POST `/api/auth/login`

**Request Body:**
```json
{
  "email": "test@example.com",
  "password": "123456"
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "data": {
    "user": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "Nguyễn Văn A",
      "email": "test@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Test Cases:**
1. ✅ Đăng nhập thành công với thông tin đúng
2. ❌ Đăng nhập với email không tồn tại (401)
3. ❌ Đăng nhập với mật khẩu sai (401)
4. ❌ Đăng nhập thiếu email hoặc password (400)

## 3. Test API Logout (Đăng xuất)

### Endpoint: POST `/api/auth/logout`

**Request Body:** (Không cần)

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Đăng xuất thành công"
}
```

## Các bước test trong Postman:

### Bước 1: Tạo Collection
1. Tạo collection mới tên "Authentication API"
2. Thêm biến môi trường `base_url` = `http://localhost:3000`

### Bước 2: Test Signup
1. Tạo request POST `{{base_url}}/api/auth/signup`
2. Thêm body JSON với thông tin user
3. Gửi request và kiểm tra response
4. Lưu token từ response để test các API khác

### Bước 3: Test Login
1. Tạo request POST `{{base_url}}/api/auth/login`
2. Thêm body JSON với email và password
3. Gửi request và kiểm tra response
4. Lưu token mới nếu cần

### Bước 4: Test Logout
1. Tạo request POST `{{base_url}}/api/auth/logout`
2. Gửi request và kiểm tra response

## Screenshots cần chụp:

1. **Signup Form + Result**: Form đăng ký và thông báo kết quả
2. **Login Form + JWT Token**: Form đăng nhập và JWT token được trả về
3. **Postman Tests**: 
   - Test `/signup` endpoint
   - Test `/login` endpoint  
   - Test `/logout` endpoint

## Lưu ý:
- Đảm bảo backend server đang chạy trên port 3000
- Đảm bảo MongoDB đã kết nối thành công
- Token JWT có thời hạn 30 ngày
- Password được hash bằng bcrypt trước khi lưu vào database

## Cách chạy ứng dụng:

### Backend:
```bash
cd backend
npm install
npm start
```

### Frontend:
```bash
cd frontend
npm start
```

Sau khi chạy, truy cập `http://localhost:3000` để test backend API và `http://localhost:3001` để test frontend.







