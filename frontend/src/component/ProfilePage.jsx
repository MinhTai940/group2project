import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import UploadAvatar from './UploadAvatar';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Lấy thông tin profile
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        setProfile(response.data.data.user);
        setFormData({
          name: response.data.data.user.name,
          email: response.data.data.user.email
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setMessage('Không thể tải thông tin profile');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && token) {
      fetchProfile();
    }
  }, [user, token]);

  // Xử lý thay đổi input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Xử lý cập nhật profile
  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/profile`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setProfile(response.data.data.user);
        setEditing(false);
        setMessage('Cập nhật thông tin thành công!');
        setMessageType('success');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật');
      setMessageType('error');
    }
  };

  // Hủy chỉnh sửa
  const handleCancel = () => {
    setFormData({
      name: profile.name,
      email: profile.email
    });
    setEditing(false);
    setMessage('');
  };

  // Xử lý cập nhật avatar
  const handleAvatarUpdate = (updatedUser) => {
    setProfile(updatedUser);
    setMessage('Avatar đã được cập nhật thành công!');
    setMessageType('success');
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading">Đang tải thông tin...</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Thông tin cá nhân</h1>
        {!editing && (
          <button 
            className="edit-btn"
            onClick={() => setEditing(true)}
          >
            Chỉnh sửa
          </button>
        )}
      </div>

      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}

      {editing ? (
        <div className="profile-edit-form">
          <h2>Cập nhật thông tin</h2>
          <form onSubmit={handleUpdate}>
            <div className="form-group">
              <label htmlFor="name">Họ và tên:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Nhập họ và tên"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Nhập email"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="save-btn">
                Lưu thay đổi
              </button>
              <button 
                type="button" 
                className="cancel-btn"
                onClick={handleCancel}
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
        <div className="profile-info">
          <div className="info-card">
            <h2>Thông tin tài khoản</h2>
            <div className="info-item">
              <label>Họ và tên:</label>
              <span>{profile?.name}</span>
            </div>
            <div className="info-item">
              <label>Email:</label>
              <span>{profile?.email}</span>
            </div>
            <div className="info-item">
              <label>Vai trò:</label>
              <span className={`role ${profile?.role}`}>
                {profile?.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
              </span>
            </div>
            <div className="info-item">
              <label>Ngày tạo:</label>
              <span>{profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('vi-VN') : 'N/A'}</span>
            </div>
            <div className="info-item">
              <label>Cập nhật lần cuối:</label>
              <span>{profile?.updatedAt ? new Date(profile.updatedAt).toLocaleDateString('vi-VN') : 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="avatar-section">
          <UploadAvatar user={profile} onAvatarUpdate={handleAvatarUpdate} />
        </div>
        </>
      )}
    </div>
  );
};

export default ProfilePage;


