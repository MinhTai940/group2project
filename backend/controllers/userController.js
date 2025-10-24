// Seed vài user để có dữ liệu test
let users = [
  { id: 1, name: 'Nguyễn Văn A', email: 'a@gmail.com' },
  { id: 2, name: 'Trần Thị B', email: 'b@gmail.com' },
  { id: 3, name: 'Lê Văn C', email: 'c@gmail.com' },
];

// GET all
exports.getUsers = (req, res) => {
  res.json(users);
};

// POST create
exports.createUser = (req, res) => {
  const { name, email } = req.body || {};
  if (!name || !email) return res.status(400).json({ message: 'name & email required' });

  // Tạo id mới: max + 1
  const newId = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
  const newUser = { id: newId, name, email };

  users.push(newUser);
  res.status(201).json(newUser);
};

// PUT update
exports.updateUser = (req, res) => {
  const { id } = req.params;            // param là string
  const idx = users.findIndex(u => String(u.id) === String(id));
  if (idx === -1) return res.status(404).json({ message: 'User not found' });

  // gộp thay đổi
  users[idx] = { ...users[idx], ...req.body };
  res.json(users[idx]);
};

// DELETE remove
exports.deleteUser = (req, res) => {
  const { id } = req.params;
  const before = users.length;
  users = users.filter(u => String(u.id) !== String(id));
  const removed = users.length < before;

  res.json({ message: removed ? 'User deleted' : 'User not found (no change)' });
};