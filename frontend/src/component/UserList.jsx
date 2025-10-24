import React, { useEffect, useState } from "react";
import axios from "axios";

function UserList() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: ""
  });

  // Lấy danh sách user khi component load
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
      alert("Không thể tải danh sách người dùng");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Hàm xóa user
  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      return;
    }

    try {
      const response = await axios.delete(`http://localhost:3000/users/${id}`);
      if (response.data) {
        setUsers(users.filter(user => user.id !== id));
        alert('Xóa người dùng thành công!');
      }
    } catch (error) {
      console.error('Lỗi khi xóa người dùng:', error);
      alert('Có lỗi xảy ra khi xóa người dùng. Vui lòng thử lại!');
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
        `http://localhost:3000/users/${editingUser.id}`,
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
    <div>
      <h2>Danh sách người dùng</h2>
      
      {/* Form sửa người dùng */}
      {editingUser && (
        <div>
          <h3>Sửa người dùng</h3>
          <form onSubmit={handleUpdate}>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Tên"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
            <button type="submit">Lưu</button>
            <button type="button" onClick={() => setEditingUser(null)}>Hủy</button>
          </form>
        </div>
      )}

      {/* Bảng danh sách người dùng */}
      <table border="1" cellPadding="8">
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
                <button onClick={() => handleEdit(user)}>Sửa</button>
                <button onClick={() => handleDelete(user.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserList;