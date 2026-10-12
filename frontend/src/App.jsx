import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import các trang
import Login from './pages/Login';
import Register from './pages/Register';
import Booking from './pages/Booking';
import OrderDetail from './pages/OrderDetail';
import WalletPage from './pages/WalletPage';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import CustomerDashboard from './pages/dashboards/CustomerDashboard';
import DriverDashboard from './pages/dashboards/DriverDashboard';
import DriverProfileAdmin from './pages/DriverProfileAdmin'; // Đã bổ sung import trang này

// =========================================================================
// HÀM MOCK ROUTE: Tự động giả lập đăng nhập dựa trên URL bạn gõ
// =========================================================================
const MockRoute = ({ role, children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Tự động tạo dữ liệu giả tương ứng với URL
    const fakeUser = {
      user_id: role === 'admin' ? 1 : role === 'customer' ? 2 : 3,
      name: role === 'admin' ? 'Quản Trị Viên' : role === 'customer' ? 'Khách Hàng Demo' : 'Tài Xế Partner',
      role: role,
      email: `${role}@logistics.com`,
      phone: '0909123456',
      balance: 500000
    };
    
    // Lưu vào LocalStorage để các trang Wallet, OrderDetail đọc được
    localStorage.setItem('userInfo', JSON.stringify(fakeUser));
    setUser(fakeUser);
  }, [role]);

  if (!user) return null; // Chờ set xong User giả mới render giao diện
  return React.cloneElement(children, { userInfo: user });
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* 1. Gõ /admin -> Tự động hóa thân thành Admin */}
      <Route path="/admin" element={<MockRoute role="admin"><AdminDashboard /></MockRoute>} />
      
      {/* 2. Gõ /guest -> Tự động hóa thân thành Khách hàng */}
      <Route path="/guest" element={<MockRoute role="customer"><CustomerDashboard /></MockRoute>} />
      
      {/* 3. Gõ /driver -> Tự động hóa thân thành Tài xế */}
      <Route path="/driver" element={<MockRoute role="driver_express"><DriverDashboard /></MockRoute>} />
      
      {/* 4. ĐƯỜNG DẪN BỊ THIẾU: Xem hồ sơ tài xế */}
      <Route path="/admin/driver/:id" element={<MockRoute role="admin"><DriverProfileAdmin /></MockRoute>} />
      
      {/* CÁC TRANG CHỨC NĂNG CHUNG */}
      <Route path="/booking" element={<Booking />} />
      <Route path="/order/:id" element={<OrderDetail />} />
      <Route path="/wallet" element={<WalletPage />} />
      
      {/* Trang 404 */}
      <Route path="*" element={<h1 style={{color: 'white', textAlign: 'center', marginTop: '50px'}}>404 - Không tìm thấy trang</h1>} />
    </Routes>
  );
}

export default App;