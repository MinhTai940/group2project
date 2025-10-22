import React, { useState } from "react";
import UserList from "./component/UserList";
import AddUser from "./component/AddUser";

function App() {
  const [refresh, setRefresh] = useState(false);

  const reloadUsers = () => setRefresh(!refresh);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Quản lý người dùng</h1>
      <AddUser onUserAdded={reloadUsers} />
      <UserList key={refresh} />
    </div>
  );
}

export default App;