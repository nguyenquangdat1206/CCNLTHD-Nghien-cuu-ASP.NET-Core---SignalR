import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Navigate, useNavigate } from 'react-router-dom';
import CustomerDashboard from './dashboards/CustomerDashboard';
import DriverDashboard from './dashboards/DriverDashboard';
import AdminDashboard from './dashboards/AdminDashboard';

export default function Dashboard() {
  const navigate = useNavigate();
  const userInfoString = localStorage.getItem('userInfo');
  const userInfo = userInfoString ? JSON.parse(userInfoString) : null;

  // Nếu chưa đăng nhập (hoặc mất dữ liệu giả lập), đá văng ra trang đăng nhập
  if (!userInfo) return <Navigate to="/login" replace />;

  // Phân luồng giao diện dựa theo vai trò (Role) đang lưu
  if (userInfo.role === 'customer') {
      return <CustomerDashboard userInfo={userInfo} />;
  } 
  else if (userInfo.role.startsWith('driver') || userInfo.role.startsWith('pending_driver')) {
      return <DriverDashboard userInfo={userInfo} />;
  } 
  else if (userInfo.role === 'admin') {
      return <AdminDashboard userInfo={userInfo} />;
  }

  // Giao diện bắt lỗi nếu Role bị sai (Đồng bộ Dark Theme)
  return (
    <Container fluid className="py-5 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh' }}>
      <div className="logistics-card p-5 text-center border" style={{ borderTop: '4px solid #FF4D4D', borderColor: 'var(--border-color)', maxWidth: '500px' }}>
          <h3 className="text-danger fw-bold mb-3">⚠️ Vai trò không hợp lệ!</h3>
          <p className="text-muted fw-bold mb-4">Không thể xác định quyền truy cập của tài khoản này trên hệ thống.</p>
          <Button variant="outline-light" style={{ borderColor: 'var(--border-color)' }} onClick={() => { localStorage.removeItem('userInfo'); navigate('/login'); }}>
             Xóa dữ liệu và Đăng nhập lại
          </Button>
      </div>
    </Container>
  );
}