import React, { useState } from "react";
import axios from "axios";

function AddUser({ onUserAdded }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email) {
      alert("Vui lòng nhập đủ thông tin!");
      return;
    }

    try {
      await axios.post("http://localhost:3000/users", { name, email });
      alert("Thêm user thành công!");
      setName("");
      setEmail("");
      onUserAdded(); // Gọi lại hàm load danh sách từ component cha
    } catch (error) {
      console.error("Lỗi khi gọi API POST:", error);
    }
  };

  return (
    <div>
      <h2>Thêm người dùng</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Thêm</button>
      </form>
    </div>
  );
}

export default AddUser;