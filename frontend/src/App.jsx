import React, { useState, useEffect } from 'react';
import UserForm from './components/UserForm';
import UserList from './components/UserList';
import * as api from './api';
import './index.css';

function App() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSave = async (formData) => {
    try {
      if (editingUser) {
        await api.updateUser(editingUser.id, formData);
        setEditingUser(null);
      } else {
        await api.createUser(formData);
      }
      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.deleteUser(id);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>User Directory (React/Node)</h1>
        <p>Premium member management portal</p>
      </header>

      <main className="main-content">
        <aside className="sidebar">
          <div className="form-card">
            <UserForm
              onSave={handleSave}
              initialData={editingUser}
              onCancel={() => setEditingUser(null)}
            />
          </div>
        </aside>

        <section className="content">
          <div className="list-card">
            <UserList
              users={users}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
