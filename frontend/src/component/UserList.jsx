import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./UserList.css";

function UserList() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: ""
  });

  // Lấy danh sách user khi component load
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/users", {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setUsers(res.data);
    } catch (error) {
      if (error.response?.status === 401) {
        alert("Bạn cần đăng nhập để xem danh sách người dùng");
      } else if (error.response?.status === 403) {
        alert("Bạn không có quyền xem danh sách người dùng");
      } else {
        console.error("Lỗi khi tải dữ liệu:", error);
        alert("Không thể tải danh sách người dùng");
      }
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Hàm xóa user
  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      return;
    }

    try {
      const response = await axios.delete(`http://localhost:3000/api/users/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (response.data) {
        setUsers(users.filter(user => user.id !== id));
        alert('Xóa người dùng thành công!');
      }
    } catch (error) {
      if (error.response?.status === 401) {
        alert("Bạn cần đăng nhập để xóa người dùng");
      } else if (error.response?.status === 403) {
        alert("Bạn không có quyền xóa người dùng này");
      } else {
        console.error('Lỗi khi xóa người dùng:', error);
        alert('Có lỗi xảy ra khi xóa người dùng. Vui lòng thử lại!');
      }
    }
  };

  // Xử lý hiển thị form sửa
  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email
    });
  };

  // Xử lý thay đổi input trong form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Xử lý cập nhật user
  const handleUpdate = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.put(
        `http://localhost:3000/api/users/${editingUser.id}`,
        formData
      );
      
      if (response.data) {
        setUsers(users.map(user => 
          user.id === editingUser.id ? response.data : user
        ));
        setEditingUser(null);
        setFormData({ name: "", email: "" });
        alert("Cập nhật thành công!");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      alert("Không thể cập nhật người dùng");
    }
  };

  return (
    <div className="user-management">
      <h2 className="page-title">Danh sách người dùng</h2>
      
      {/* Form sửa người dùng */}
      {editingUser && (
        <div className="edit-form">
          <h3>Sửa người dùng</h3>
          <form onSubmit={handleUpdate}>
            <div className="form-group">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Tên"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
              />
            </div>
            <button type="submit" className="btn btn-save">Lưu</button>
            <button 
              type="button" 
              className="btn btn-cancel"
              onClick={() => setEditingUser(null)}
            >
              Hủy
            </button>
          </form>
        </div>
      )}

      {/* Bảng danh sách người dùng */}
      <table className="users-table">
        <thead>
          <tr>
            <th>Tên</th>
            <th>Email</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <button 
                  className="btn btn-edit"
                  onClick={() => handleEdit(user)}
                >
                  Sửa
                </button>
                <button 
                  className="btn btn-delete"
                  onClick={() => handleDelete(user.id)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserList;