import React, { useState, useEffect, useRef } from 'react';
import { FiUpload } from 'react-icons/fi';

const UserForm = ({ onSave, initialData, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    age: '',
    gender: 'Male'
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        address: initialData.address || '',
        city: initialData.city || '',
        age: initialData.age || '',
        gender: initialData.gender || 'Male'
      });
      if (initialData.image) {
        setImagePreview(`http://localhost:3001${initialData.image}`);
      } else {
        setImagePreview(null);
      }
      setImageFile(null);
    } else {
      resetForm();
    }
  }, [initialData]);

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      city: '',
      age: '',
      gender: 'Male'
    });
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });
    if (imageFile) {
      data.append('image', imageFile);
    }
    onSave(data);
    if (!initialData) {
      resetForm();
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem' }}>
        {initialData ? 'Edit User' : 'Add New User'}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Profile Image</label>
          <div className="image-upload-wrapper">
            <div className="image-preview" onClick={() => fileInputRef.current.click()}>
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" />
              ) : (
                <div className="image-placeholder">
                  <FiUpload size={24} />
                  <span>Upload</span>
                </div>
              )}
            </div>
            <input 
              type="file" 
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              style={{ display: 'none' }}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Full Name *</label>
          <input 
            type="text" 
            name="name" 
            className="form-control" 
            value={formData.name} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="form-group" style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <label>Age</label>
            <input 
              type="number" 
              name="age" 
              className="form-control" 
              value={formData.age} 
              onChange={handleChange} 
            />
          </div>
          <div style={{ flex: 1 }}>
            <label>Gender</label>
            <select 
              name="gender" 
              className="form-control" 
              value={formData.gender} 
              onChange={handleChange}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Address</label>
          <input 
            type="text" 
            name="address" 
            className="form-control" 
            value={formData.address} 
            onChange={handleChange} 
          />
        </div>

        <div className="form-group">
          <label>City</label>
          <input 
            type="text" 
            name="city" 
            className="form-control" 
            value={formData.city} 
            onChange={handleChange} 
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button type="submit" className="btn btn-primary">
            {initialData ? 'Update User' : 'Save User'}
          </button>
          {initialData && (
            <button type="button" className="btn btn-edit" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default UserForm;
