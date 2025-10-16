import React, { useEffect, useState } from "react";

interface User {
  id: number;
  name: string;
  email: string;
}

const API_URL = "http://localhost:4000/users";

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState<{ name: string; email: string }>({
    name: "",
    email: "",
  });
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then(setUsers);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId === null) {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const newUser = await res.json();
      setUsers([...users, newUser]);
    } else {
      const res = await fetch(`${API_URL}/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const updatedUser = await res.json();
      setUsers(users.map((u) => (u.id === editId ? updatedUser : u)));
      setEditId(null);
    }
    setForm({ name: "", email: "" });
  };

  const handleEdit = (user: User) => {
    setForm({ name: user.name, email: user.email });
    setEditId(user.id);
  };

  const handleDelete = async (id: number) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    setUsers(users.filter((u) => u.id !== id));
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          className="border p-2 rounded w-1/3"
          required
        />
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="border p-2 rounded w-1/3"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {editId === null ? "Add" : "Update"}
        </button>
        {editId !== null && (
          <button
            type="button"
            onClick={() => {
              setEditId(null);
              setForm({ name: "", email: "" });
            }}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Cancel
          </button>
        )}
      </form>
      <ul>
        {users.map((user) => (
          <li
            key={user.id}
            className="flex justify-between items-center border-b py-2"
          >
            <span>
              {user.name} ({user.email})
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(user)}
                className="bg-yellow-400 px-2 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(user.id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
