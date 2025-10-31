import React, { useState } from "react";
import axios from "axios";
import "./AddUser.css";

function AddUser({ onUserAdded }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate name
    if (!name.trim()) {
      alert("Name không được để trống");
      return;
    }

    // Validate email format
    if (!/\S+@\S+\.\S+/.test(email)) {
      alert("Email không hợp lệ");
      return;
    }

    try {
      await axios.post("http://localhost:3000/api/users", { 
        name: name.trim(), 
        email: email.trim() 
      });
      alert("Thêm user thành công!");
      setName("");
      setEmail("");
      onUserAdded(); // Gọi lại hàm load danh sách từ component cha
    } catch (error) {
      console.error("Lỗi khi thêm user:", error);
      alert("Có lỗi xảy ra khi thêm user. Vui lòng thử lại!");
    }
  };

  return (
    <div className="add-user-form">
      <h2>Thêm người dùng</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Thêm</button>
      </form>
    </div>
  );
}

export default AddUser;