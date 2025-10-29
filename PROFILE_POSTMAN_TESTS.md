# Hướng dẫn test API Profile với Postman

## Cấu hình cơ bản
- **Base URL**: `http://localhost:3000`
- **Content-Type**: `application/json`

## 🔐 **Authentication Required**
Tất cả API profile đều yêu cầu JWT token trong header:
```
Authorization: Bearer <your-jwt-token>
```

## 1. Test API Get Profile

### Endpoint: GET `/api/profile`

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "Nguyễn Văn A",
      "email": "test@example.com",
      "role": "user",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

**Test Cases:**
1. ✅ Lấy profile với token hợp lệ
2. ❌ Lấy profile không có token (401)
3. ❌ Lấy profile với token không hợp lệ (403)

## 2. Test API Update Profile

### Endpoint: PUT `/api/profile`

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Nguyễn Văn B",
  "email": "newemail@example.com"
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "Nguyễn Văn B",
      "email": "newemail@example.com",
      "role": "user",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T11:45:00.000Z"
    }
  }
}
```

**Test Cases:**
1. ✅ Cập nhật profile thành công với dữ liệu hợp lệ
2. ❌ Cập nhật profile thiếu name hoặc email (400)
3. ❌ Cập nhật profile với email không hợp lệ (400)
4. ❌ Cập nhật profile với email đã tồn tại (409)
5. ❌ Cập nhật profile không có token (401)
6. ❌ Cập nhật profile với token không hợp lệ (403)

---

# Hoạt động 3 - Postman test quản trị User (Admin)

## RBAC yêu cầu
- Chỉ ADMIN được gọi `GET /api/users`
- `DELETE /api/users/:id` cho phép ADMIN hoặc chính chủ (email khớp) xóa

## 3.1 GET danh sách user (Admin)
```
GET http://localhost:3000/api/users
Authorization: Bearer <admin-token>
```
- Expected: 200 trả về danh sách users (UserManagement)
- Nếu dùng token user thường → 403 Forbidden
- Nếu không gửi token → 401 Access token required

## 3.2 DELETE user
```
DELETE http://localhost:3000/api/users/<id>
Authorization: Bearer <token>
```
- Với admin-token: xóa bất kỳ id hợp lệ → 200 { message: "User deleted" }
- Với user-token: chỉ xóa được user có email trùng với account đang đăng nhập (self) → 200; nếu khác → 403
- Không token → 401

## Các bước test trong Postman:

### Bước 1: Lấy JWT Token
1. Đăng nhập qua API `/api/auth/login` trước
2. Copy token từ response
3. Lưu token vào biến môi trường `jwt_token`

### Bước 2: Tạo Collection
1. Tạo collection mới tên "Profile API"
2. Thêm biến môi trường:
   - `base_url` = `http://localhost:3000`
   - `jwt_token` = `<your-jwt-token>`

### Bước 3: Test Get Profile
1. Tạo request GET `{{base_url}}/api/profile`
2. Thêm header `Authorization: Bearer {{jwt_token}}`
3. Gửi request và kiểm tra response

### Bước 4: Test Update Profile
1. Tạo request PUT `{{base_url}}/api/profile`
2. Thêm header `Authorization: Bearer {{jwt_token}}`
3. Thêm body JSON với dữ liệu cập nhật
4. Gửi request và kiểm tra response

## Screenshots cần chụp:

1. **Profile Page hiển thị user info**: 
   - Trang profile với thông tin user đầy đủ
   - Hiển thị name, email, role, ngày tạo, ngày cập nhật

2. **Form cập nhật thông tin**:
   - Form chỉnh sửa profile
   - Các trường name và email
   - Nút "Lưu thay đổi" và "Hủy"

3. **Postman test API /profile**:
   - Test GET /api/profile với token
   - Test PUT /api/profile với dữ liệu mới
   - Response thành công và lỗi

## Lưu ý:
- Đảm bảo backend server đang chạy trên port 3000
- Đảm bảo đã đăng nhập và có JWT token hợp lệ
- Token JWT có thời hạn 30 ngày
- Email phải unique trong hệ thống

## Cách chạy ứng dụng:

### Backend:
```bash
cd backend
npm start
```

### Frontend:
```bash
cd frontend
npm start
```

Sau khi chạy:
- Truy cập `http://localhost:3001`
- Đăng nhập với tài khoản đã tạo
- Click tab "Thông tin cá nhân" để xem profile
- Test API với Postman theo hướng dẫn trên

