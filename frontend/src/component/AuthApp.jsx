import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import UserList from './UserList';
import AddUser from './AddUser';
import ProfilePage from './ProfilePage';
import './AuthApp.css';

const AuthApp = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [showSignup, setShowSignup] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [currentView, setCurrentView] = useState('users'); // 'users' or 'profile'

  const reloadUsers = () => setRefresh(!refresh);

  const handleAuthSuccess = () => {
    setShowSignup(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="auth-container">
        <div className="auth-header">
          <h1>Hệ thống quản lý người dùng</h1>
          <p>Vui lòng đăng nhập hoặc đăng ký để tiếp tục</p>
        </div>

        <div className="auth-forms">
          {!showSignup ? (
            <div className="auth-form-section">
              <LoginForm onSuccess={handleAuthSuccess} />
              <div className="auth-switch">
                <p>Chưa có tài khoản?</p>
                <button 
                  onClick={() => setShowSignup(true)}
                  className="switch-btn"
                >
                  Đăng ký ngay
                </button>
              </div>
            </div>
          ) : (
            <div className="auth-form-section">
              <SignupForm onSuccess={handleAuthSuccess} />
              <div className="auth-switch">
                <p>Đã có tài khoản?</p>
                <button 
                  onClick={() => setShowSignup(false)}
                  className="switch-btn"
                >
                  Đăng nhập
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // If non-admin, force view to profile
  const isAdmin = user?.role === 'admin';
  const effectiveView = isAdmin ? currentView : 'profile';

  return (
    <div className="app-container">
      <div className="app-header">
        <h1>Hệ thống quản lý</h1>
        <div className="user-info">
          <span>Xin chào, {user.name} ({user.role})</span>
          <button onClick={logout} className="logout-btn">
            Đăng xuất
          </button>
        </div>
      </div>

      <div className="app-navigation">
        {isAdmin && (
          <button 
            className={`nav-btn ${effectiveView === 'users' ? 'active' : ''}`}
            onClick={() => setCurrentView('users')}
          >
            Quản lý người dùng
          </button>
        )}
        <button 
          className={`nav-btn ${effectiveView === 'profile' ? 'active' : ''}`}
          onClick={() => setCurrentView('profile')}
        >
          Thông tin cá nhân
        </button>
      </div>

      <div className="app-content">
        {effectiveView === 'users' ? (
          <>
            <AddUser onUserAdded={reloadUsers} />
            <UserList key={refresh} />
          </>
        ) : (
          <ProfilePage />
        )}
      </div>
    </div>
  );
};

export default AuthApp;


