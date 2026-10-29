import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Badge, Table, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import DashboardSkeleton from '../../components/DashboardSkeleton';

export default function AdminDashboard({ userInfo }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [adminTab, setAdminTab] = useState('orders'); 

  const adminTotalRevenue = 15000000;
  const adminPlatformProfit = 3000000;
  const mockOrders = [
    { id: 101, customer: 'Khách Hàng Demo', driver: 'Nguyễn Quang Đạt', price: 65000, status: 'completed' },
    { id: 102, customer: 'Trần Văn B', driver: null, price: 120000, status: 'pending' },
    { id: 103, customer: 'Khách Hàng Demo', driver: 'Nguyễn Quang Đạt', price: 45000, status: 'delivering' }
  ];

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  if (loading) return <DashboardSkeleton />;

  return (
    <Container fluid className="py-5" style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh' }}>
      <Container style={{ maxWidth: '1200px' }}>
        
        <div className="d-flex justify-content-between align-items-center mb-5 pb-3 border-bottom" style={{ borderColor: 'var(--border-color)' }}>
          <div className="d-flex align-items-center gap-3">
            <div className="rounded-circle d-flex justify-content-center align-items-center border" style={{ width: '60px', height: '60px', backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)', fontSize: '24px' }}>👑</div>
            <div>
              <h4 className="text-white fw-bold mb-1">Hệ thống Admin</h4>
              <Badge bg="danger" className="border border-secondary">SUPER ADMIN</Badge>
            </div>
          </div>
          <Button variant="outline-danger" className="fw-bold px-4" onClick={() => { localStorage.removeItem('userInfo'); navigate('/login'); }}>ĐĂNG XUẤT</Button>
        </div>

        <Row className="g-4 mb-5">
          <Col md={4}>
            <div className="logistics-card p-4 h-100 d-flex flex-column justify-content-between" style={{ border: '2px solid var(--brand-orange)', background: 'linear-gradient(145deg, rgba(255,107,0,0.1) 0%, rgba(0,0,0,0) 100%)' }}>
               <div>
                 <div className="text-muted fw-bold mb-2 text-uppercase">Doanh Thu Cước Phí</div>
                 <h2 className="fw-bold mb-3 text-white">{adminTotalRevenue.toLocaleString()}đ</h2>
               </div>
               <Button className="btn-orange fw-bold py-3 w-100" onClick={() => setAdminTab('orders')}>🛒 QUẢN LÝ TẤT CẢ ĐƠN</Button>
            </div>
          </Col>
          <Col md={4}>
            <div className="logistics-card p-4 h-100 d-flex flex-column justify-content-between text-center" style={{ border: '1px solid #4ADE80' }}>
               <div>
                 <div className="text-muted fw-bold mb-2 text-uppercase">Lợi Nhuận Hệ Thống (20%)</div>
                 <h2 className="fw-bold mb-3" style={{ color: '#4ADE80' }}>{adminPlatformProfit.toLocaleString()}đ</h2>
               </div>
               <Button variant="outline-success" className="fw-bold py-3 w-100" style={{ borderColor: '#4ADE80', color: '#4ADE80' }} onClick={() => navigate('/wallet')}>💳 RÚT TIỀN VÍ ADMIN</Button>
            </div>
          </Col>
          <Col md={4}>
            <div className="logistics-card p-4 h-100 d-flex flex-column justify-content-between text-end" style={{ border: '1px solid #3b82f6' }}>
               <div>
                 <div className="text-muted fw-bold mb-2 text-uppercase">Tổng số User hệ thống</div>
                 <h2 className="fw-bold mb-3 text-white">450 Tài khoản</h2>
               </div>
               <Button variant="outline-primary" className="fw-bold py-3 w-100" style={{ borderColor: '#3b82f6', color: '#3b82f6' }} onClick={() => setAdminTab('users')}>👥 QUẢN LÝ NGƯỜI DÙNG</Button>
            </div>
          </Col>
        </Row>

        <h5 className="text-white fw-bold mb-3">
            {adminTab === 'orders' ? '📋 Danh sách Đơn hàng (Demo)' : '👥 Danh sách Người dùng (Demo)'}
        </h5>
        
        {adminTab === 'orders' && (
          <div className="logistics-card p-0 overflow-hidden">
            <Table className="align-middle mb-0" style={{ '--bs-table-bg': 'transparent', '--bs-table-color': 'var(--text-main)', '--bs-table-border-color': 'var(--border-color)' }}>
              <thead style={{ backgroundColor: 'var(--bg-input)' }}>
                <tr>
                  <th className="py-3 px-4 text-muted fw-bold">Mã Đơn</th>
                  <th className="py-3 text-muted fw-bold">Khách - Tài xế</th>
                  <th className="py-3 text-muted fw-bold">Cước phí</th>
                  <th className="py-3 text-muted fw-bold">Trạng thái</th>
                  <th className="py-3 px-4 text-end text-muted fw-bold">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {mockOrders.map(order => (
                  <tr key={order.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/order/${order.id}`)}>
                    <td className="py-4 px-4 fw-bold text-white">#{order.id}</td>
                    <td>
                      <span className="text-white fw-bold d-block">Khách: {order.customer}</span>
                      <span className="text-info fw-bold">Xế: {order.driver || 'Chưa nhận'}</span>
                    </td>
                    <td className="fw-bold text-success">{order.price.toLocaleString()}đ</td>
                    <td><Badge bg={order.status === 'completed' ? 'success' : order.status === 'pending' ? 'secondary' : 'warning'}>{order.status}</Badge></td>
                    <td className="px-4 text-end"><Button variant="outline-light" size="sm" style={{ borderColor: 'var(--border-color)' }}>Mở ❯</Button></td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
        
        {adminTab === 'users' && (
          <Alert variant="info" className="logistics-card border-0 fw-bold">Bảng quản lý người dùng đang ở chế độ Offline Mockup.</Alert>
        )}

      </Container>
    </Container>
  );
}