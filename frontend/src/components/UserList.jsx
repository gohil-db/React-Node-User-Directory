import React from 'react';
import { FiEdit2, FiTrash2, FiMapPin, FiUser } from 'react-icons/fi';

const UserList = ({ users, onEdit, onDelete }) => {
  if (!users || users.length === 0) {
    return (
      <div className="empty-state">
        <h2>No users found</h2>
        <p>Add a new user to see them listed here.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem' }}>User Directory ({users.length})</h2>
      <div className="users-grid">
        {users.map((user) => (
          <div key={user.id} className="user-card">
            <img 
              src={user.image ? `http://localhost:3001${user.image}` : 'https://via.placeholder.com/100'} 
              alt={user.name} 
              className="user-avatar" 
            />
            <h3 className="user-name">{user.name}</h3>
            
            <div className="user-details">
              <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <FiUser size={14} /> {user.age ? `${user.age} yrs` : 'N/A'} • {user.gender}
              </p>
              <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <FiMapPin size={14} /> {user.city ? user.city : 'No City'}
              </p>
            </div>
            
            <div className="card-actions">
              <button 
                className="btn btn-edit" 
                onClick={() => onEdit(user)}
                title="Edit User"
              >
                <FiEdit2 /> Edit
              </button>
              <button 
                className="btn btn-danger" 
                onClick={() => onDelete(user.id)}
                title="Delete User"
              >
                <FiTrash2 /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
