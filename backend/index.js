import express from 'express';
import cors from 'cors';

const app = express();
const port = 4000;
app.use(cors());
app.use(express.json());

let users = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' }
];

// GET /users
app.get('/users', (req, res) => {
  res.json(users);
});

// POST /users
app.post('/users', (req, res) => {
  const { name, email } = req.body;
  const id = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
  const newUser = { id, name, email };
  users.push(newUser);
  res.status(201).json(newUser);
});

// PUT /users/:id
app.put('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email } = req.body;
  const user = users.find(u => u.id === id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  user.name = name;
  user.email = email;
  res.json(user);
});

// DELETE /users/:id
app.delete('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) return res.status(404).json({ error: 'User not found' });
  users.splice(idx, 1);
  res.status(204).end();
});

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});
