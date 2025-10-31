import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ForgotPassword.css';

const ForgotPassword = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [resetUrl, setResetUrl] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:3000/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(data.message || 'Vui lòng kiểm tra email của bạn.');
        setIsSuccess(true);
        if (data.data && data.data.resetUrl) {
          setResetUrl(data.data.resetUrl);
        } else {
          setResetUrl('');
        }
      } else {
        setMessage(data.message);
        setIsSuccess(false);
      }
    } catch (error) {
      setMessage('Có lỗi xảy ra. Vui lòng thử lại.');
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <h2>Quên mật khẩu</h2>
        <p className="forgot-password-description">
          Nhập email của bạn để nhận link reset mật khẩu
        </p>

        {message && (
          <div className={`message ${isSuccess ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="forgot-password-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn"
                required
                disabled={isLoading}
              />
            </div>

            <button 
              type="submit" 
              className="submit-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Đang gửi...' : 'Gửi link reset'}
            </button>
          </form>
        ) : (
          <div className="success-actions">
            <p>Vui lòng kiểm tra email của bạn để reset mật khẩu.</p>
            {resetUrl && (
              <button
                onClick={() => window.location.assign(resetUrl)}
                className="back-to-login-btn"
              >
                Mở link đặt lại mật khẩu
              </button>
            )}
            <button 
              onClick={() => navigate('/login')}
              className="back-to-login-btn"
            >
              Quay lại đăng nhập
            </button>
          </div>
        )}

        <div className="forgot-password-footer">
          <button 
            onClick={() => navigate('/login')}
            className="back-link"
          >
            ← Quay lại đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
