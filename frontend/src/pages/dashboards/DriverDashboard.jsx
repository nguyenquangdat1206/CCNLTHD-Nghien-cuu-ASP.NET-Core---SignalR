import React, { useState, useEffect } from 'react';
import { Container, Button, Modal, Form, Nav, Badge, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Circle, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import DashboardSkeleton from '../../components/DashboardSkeleton';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

export default function DriverDashboard({ userInfo }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isReady, setIsReady] = useState(true);
  const [driverLocation, setDriverLocation] = useState({ lat: 10.7626, lng: 106.6601 });
  const [mainTab, setMainTab] = useState('radar');
  const [tripSubTab, setTripSubTab] = useState('active');

  const [showMenuModal, setShowMenuModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const [profileData, setProfileData] = useState({
    name: userInfo?.name || 'Tài Xế Partner',
    phone: userInfo?.phone || '0868923294',
    license_plate: userInfo?.license_plate || '51H-264.39'
  });

  const [activeOrders] = useState([
    {
      id: 201,
      pickup: 'Đại học Sài Gòn (273 An Dương Vương, Q.5)',
      dropoff: 'Landmark 81 (720A Điện Biên Phủ, Q.Bình Thạnh)',
      price: 65000,
      status: 'delivering',
      sender: 'Nguyễn Quang Đạt',
      receiver: 'Trần Thị B',
      distance: '8.5'
    },
    {
      id: 202,
      pickup: 'Chợ Bến Thành (Lê Lợi, Q.1)',
      dropoff: 'Sân bay Tân Sơn Nhất (Q.Tân Bình)',
      price: 120000,
      status: 'picking_up',
      sender: 'Lê Văn C',
      receiver: 'Phạm Văn D',
      distance: '7.2'
    }
  ]);

  const [historyOrders] = useState([
    { id: 198, pickup: 'Quận 10, TP.HCM', dropoff: 'Quận 3, TP.HCM', price: 45000, status: 'completed', distance: '3.5' },
    { id: 199, pickup: 'Khu công nghệ cao, TP.Thủ Đức', dropoff: 'Đường D2, Q.Bình Thạnh', price: 85000, status: 'completed', distance: '9.0' }
  ]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => setDriverLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }));
    }
  }, []);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updatedUser = { ...userInfo, ...profileData };
    localStorage.setItem('userInfo', JSON.stringify(updatedUser));
    setShowProfileModal(false);
    alert('✅ Đã cập nhật thông tin tài xế thành công!');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'picking_up': return <Badge bg="warning" className="px-2 py-1 text-dark">Đang tới lấy hàng</Badge>;
      case 'delivering': return <Badge style={{ backgroundColor: 'var(--brand-orange)' }} className="px-2 py-1 text-white">Đang giao hàng</Badge>;
      case 'completed': return <Badge bg="success" className="px-2 py-1">Đã hoàn thành</Badge>;
      case 'cancelled': return <Badge bg="danger" className="px-2 py-1">Đã hủy</Badge>;
      default: return <Badge bg="secondary" className="px-2 py-1">{status}</Badge>;
    }
  };

  if (loading) return <DashboardSkeleton />;

  return (
    <Container fluid className="py-2 py-md-4" style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '440px', margin: '0 auto' }}>
        
        <div 
          className="logistics-card p-3 mb-3 d-flex justify-content-between align-items-center transition-hover" 
          style={{ borderTop: '4px solid var(--brand-orange)', cursor: 'pointer' }}
          onClick={() => setShowMenuModal(true)}
        >
          <div className="d-flex align-items-center gap-3">
            <div className="rounded-circle d-flex justify-content-center align-items-center border position-relative" style={{ width: '46px', height: '46px', backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)', fontSize: '20px' }}>
              🛵
              <span className="position-absolute bottom-0 end-0 p-1 rounded-circle border border-dark" style={{ backgroundColor: isReady ? '#4ADE80' : '#888', width: '12px', height: '12px' }}></span>
            </div>
            <div>
              <h6 className="text-white fw-bold mb-0">{profileData.name}</h6>
              <small className="text-warning fw-bold" style={{ fontSize: '11px' }}>🚘 {profileData.license_plate}</small>
            </div>
          </div>
          
          <div className="d-flex align-items-center gap-2">
            <Badge bg={isReady ? "success" : "secondary"} className="px-2 py-1" style={{ fontSize: '11px' }}>
              {isReady ? 'ONLINE' : 'OFFLINE'}
            </Badge>
            <span className="text-muted fs-5">⚙️</span>
          </div>
        </div>

        <div className="logistics-card mb-3 p-1 border-0">
          <Nav variant="pills" className="nav-fill gap-1" activeKey={mainTab} onSelect={(k) => setMainTab(k)}>
            <Nav.Item>
              <Nav.Link eventKey="radar" className={`fw-bold py-2 ${mainTab === 'radar' ? 'btn-orange text-white' : 'text-muted'}`} style={{ borderRadius: '10px', fontSize: '13px' }}>
                📡 Radar Đơn
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="my_trips" className={`fw-bold py-2 ${mainTab === 'my_trips' ? 'btn-orange text-white' : 'text-muted'}`} style={{ borderRadius: '10px', fontSize: '13px' }}>
                🏍️ Chuyến Của Tôi ({activeOrders.length})
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </div>

        {mainTab === 'radar' && (
          <div className="logistics-card p-2 mb-3" style={{ border: '1px solid var(--border-color)', borderRadius: '12px' }}>
            <small className="fw-bold text-white mb-2 d-block px-1">📡 RADAR BẮT ĐƠN TỰ ĐỘNG (1.5KM)</small>
            <div style={{ height: '320px', width: '100%', borderRadius: '10px', overflow: 'hidden', opacity: isReady ? 1 : 0.4 }}>
              <MapContainer center={[driverLocation.lat, driverLocation.lng]} zoom={14} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                <Marker position={[driverLocation.lat, driverLocation.lng]}><Popup>Vị trí tài xế</Popup></Marker>
                <Circle center={[driverLocation.lat, driverLocation.lng]} radius={1500} pathOptions={{ color: '#FF6633', fillColor: '#FF6633', fillOpacity: 0.15, weight: 2 }} />
              </MapContainer>
            </div>
            {!isReady && <small className="text-danger d-block text-center mt-2 fw-bold">Hãy mở Menu để chuyển sang trạng thái ONLINE!</small>}
          </div>
        )}

        {mainTab === 'my_trips' && (
          <div>
            <div className="d-flex justify-content-center gap-2 mb-3">
              <Button size="sm" className={`fw-bold px-3 py-1 ${tripSubTab === 'active' ? 'btn-orange text-white' : 'btn-dark text-muted border border-secondary'}`} style={{ borderRadius: '20px', fontSize: '12px' }} onClick={() => setTripSubTab('active')}>
                ⚡ Đang chạy ({activeOrders.length})
              </Button>
              <Button size="sm" className={`fw-bold px-3 py-1 ${tripSubTab === 'history' ? 'btn-orange text-white' : 'btn-dark text-muted border border-secondary'}`} style={{ borderRadius: '20px', fontSize: '12px' }} onClick={() => setTripSubTab('history')}>
                📜 Lịch sử ({historyOrders.length})
              </Button>
            </div>

            {tripSubTab === 'active' && (
              activeOrders.length === 0 ? (
                <div className="logistics-card p-4 text-center text-muted fw-bold">Chưa có chuyến xe nào đang chạy.</div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {activeOrders.map(order => (
                    <div key={order.id} className="logistics-card p-3 position-relative" style={{ borderLeft: '4px solid var(--brand-orange)', cursor: 'pointer' }} onClick={() => navigate(`/order/${order.id}`)}>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="fw-bold text-white fs-6">Đơn hàng #{order.id}</span>
                        {getStatusBadge(order.status)}
                      </div>
                      <div className="text-white mb-1" style={{ fontSize: '13px' }}>📍 <strong>Lấy:</strong> {order.pickup}</div>
                      <div className="text-white mb-2" style={{ fontSize: '13px' }}>🚩 <strong>Giao:</strong> {order.dropoff}</div>
                      <div className="d-flex justify-content-between align-items-center pt-2 border-top" style={{ borderColor: 'var(--border-color)' }}>
                        <span className="fw-bold" style={{ color: '#4ADE80', fontSize: '15px' }}>
                          {(order.price * 0.8).toLocaleString()}đ <small className="text-muted fw-normal" style={{ fontSize: '11px' }}>(Thu nhập)</small>
                        </span>
                        <Button size="sm" variant="outline-light" className="fw-bold py-1" style={{ borderColor: 'var(--brand-orange)', color: 'var(--brand-orange)', fontSize: '12px' }}>
                          Chi tiết ➔
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {tripSubTab === 'history' && (
              <div className="d-flex flex-column gap-2">
                {historyOrders.map(order => (
                  <div key={order.id} className="logistics-card p-3 d-flex justify-content-between align-items-center" style={{ opacity: 0.85, cursor: 'pointer' }} onClick={() => navigate(`/order/${order.id}`)}>
                    <div>
                      <div className="fw-bold text-white mb-1" style={{ fontSize: '13px' }}>Đơn #{order.id} ({order.distance} km)</div>
                      <div className="text-muted" style={{ fontSize: '12px' }}>📍 {order.pickup} ➔ 🚩 {order.dropoff}</div>
                    </div>
                    <div className="text-end">
                      <div className="fw-bold text-success mb-1" style={{ fontSize: '13px' }}>+{(order.price * 0.8).toLocaleString()}đ</div>
                      {getStatusBadge(order.status)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <Modal show={showMenuModal} onHide={() => setShowMenuModal(false)} centered contentClassName="logistics-card border-0">
          <Modal.Header closeButton className="border-bottom" style={{ borderColor: 'var(--border-color)' }}>
            <Modal.Title className="fw-bold text-white fs-5">⚙️ Cài Đặt Tài Khoản</Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-3">
            <div className="p-3 rounded-3 mb-3 text-center" style={{ backgroundColor: 'var(--bg-input)' }}>
              <h6 className="text-white fw-bold mb-1">{profileData.name}</h6>
              <small className="text-muted d-block">SĐT: {profileData.phone}</small>
              <small className="text-warning fw-bold">Biển số: {profileData.license_plate}</small>
            </div>

            <ListGroup variant="flush" className="bg-transparent">
              <ListGroup.Item action className="d-flex justify-content-between align-items-center p-3 mb-2 rounded-3 text-white border-0" style={{ backgroundColor: 'var(--bg-input)' }} onClick={() => { setIsReady(!isReady); setShowMenuModal(false); }}>
                <span className="fw-bold">{isReady ? '🟢 Trạng Thái: Đang Online' : '😴 Trạng Thái: Đang Offline'}</span>
                <Badge bg={isReady ? 'success' : 'secondary'}>{isReady ? 'TẮT' : 'BẬT'}</Badge>
              </ListGroup.Item>
              <ListGroup.Item action className="d-flex justify-content-between align-items-center p-3 mb-2 rounded-3 text-white border-0" style={{ backgroundColor: 'var(--bg-input)' }} onClick={() => { setShowMenuModal(false); navigate('/wallet'); }}>
                <span className="fw-bold">💳 Ví Tài Xế</span>
                <span className="fw-bold text-success">{(userInfo?.balance || 500000).toLocaleString()}đ ➔</span>
              </ListGroup.Item>
              <ListGroup.Item action className="d-flex justify-content-between align-items-center p-3 mb-2 rounded-3 text-white border-0" style={{ backgroundColor: 'var(--bg-input)' }} onClick={() => { setShowMenuModal(false); setMainTab('my_trips'); setTripSubTab('history'); }}>
                <span className="fw-bold">📜 Lịch Sử Đơn Hàng</span>
                <span className="text-muted">➔</span>
              </ListGroup.Item>
              <ListGroup.Item action className="d-flex justify-content-between align-items-center p-3 mb-2 rounded-3 text-white border-0" style={{ backgroundColor: 'var(--bg-input)' }} onClick={() => { setShowMenuModal(false); setShowProfileModal(true); }}>
                <span className="fw-bold">✏️ Chỉnh Sửa Hồ Sơ</span>
                <span className="text-muted">➔</span>
              </ListGroup.Item>
              <ListGroup.Item action className="d-flex justify-content-between align-items-center p-3 rounded-3 text-danger fw-bold border-0" style={{ backgroundColor: 'rgba(255, 77, 77, 0.1)' }} onClick={() => { localStorage.removeItem('userInfo'); navigate('/login'); }}>
                <span>🚪 Đăng Xuất</span>
                <span>➔</span>
              </ListGroup.Item>
            </ListGroup>
          </Modal.Body>
        </Modal>

        <Modal show={showProfileModal} onHide={() => setShowProfileModal(false)} centered contentClassName="logistics-card border-0">
          <Modal.Header closeButton className="border-bottom" style={{ borderColor: 'var(--border-color)' }}>
            <Modal.Title className="fw-bold text-white fs-5">✏️ Chỉnh Sửa Hồ Sơ Tài Xế</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSaveProfile}>
            <Modal.Body className="p-3">
              <Form.Group className="mb-3">
                <Form.Label className="text-muted fw-bold" style={{ fontSize: '12px' }}>HỌ VÀ TÊN TÀI XẾ</Form.Label>
                <Form.Control type="text" className="logistics-input" value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="text-muted fw-bold" style={{ fontSize: '12px' }}>SỐ ĐIỆN THOẠI SỬ DỤNG</Form.Label>
                <Form.Control type="tel" className="logistics-input" value={profileData.phone} onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="text-muted fw-bold" style={{ fontSize: '12px' }}>BIỂN SỐ XE ĐĂNG KÝ</Form.Label>
                <Form.Control type="text" className="logistics-input text-uppercase" value={profileData.license_plate} onChange={(e) => setProfileData({ ...profileData, license_plate: e.target.value })} required />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer className="border-top" style={{ borderColor: 'var(--border-color)' }}>
              <Button variant="outline-secondary" size="sm" onClick={() => setShowProfileModal(false)}>Hủy</Button>
              <Button type="submit" size="sm" className="btn-orange px-3 fw-bold">Lưu Hồ Sơ</Button>
            </Modal.Footer>
          </Form>
        </Modal>

      </div>
    </Container>
  );
}