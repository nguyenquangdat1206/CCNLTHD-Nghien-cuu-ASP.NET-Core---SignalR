import React, { useState, useEffect, useRef } from 'react';
import { Container, Button, Badge, Modal, Form, Row, Col, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import SupportWidget from '../../components/SupportWidget';
import SwipeButton from '../../components/SwipeButton';

import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Circle, Popup } from 'react-leaflet';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function DriverDashboard({ userInfo }) {
  const navigate = useNavigate();
  const [mainTab, setMainTab] = useState('radar'); 
  const [driverTab, setDriverTab] = useState('active'); 
  const [isReady, setIsReady] = useState(false);
  const [driverLocation, setDriverLocation] = useState({ lat: 10.762622, lng: 106.660172 });

  // Dữ liệu giả lập
  const [pendingOrders, setPendingOrders] = useState([]);
  const [myOrders, setMyOrders] = useState([]); 
  const [showIncomingPopup, setShowIncomingPopup] = useState(false);
  const [incomingOrder, setIncomingOrder] = useState(null);
  const audioRef = useRef(null);

  // GIẢ LẬP RADAR BẮT ĐƠN: Khi bật "ĐANG NHẬN ĐƠN", sau 3 giây sẽ tự động nổ 1 đơn
  useEffect(() => {
    let timer;
    if (isReady && pendingOrders.length === 0) {
      timer = setTimeout(() => {
        const fakeOrder = { id: 101, pickup: 'Trường Đại học Sài Gòn', dropoff: 'Landmark 81, Bình Thạnh', calculated_price: 65000, is_batch: false, ids: [101] };
        setPendingOrders([fakeOrder]);
        setIncomingOrder(fakeOrder);
        setShowIncomingPopup(true);
        // Phát âm thanh
        if (!audioRef.current) {
            const audio = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
            audio.loop = true; audio.play().catch(e=>e); 
            audioRef.current = audio;
        }
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [isReady]);

  const handleToggleReady = () => setIsReady(!isReady);

  const stopAlertSound = () => { if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; } };

  const handleAcceptOrder = (orderId) => {
    // Giả lập chuyển đơn hàng từ Pending sang Chuyến Của Tôi
    const acceptedOrder = pendingOrders.find(o => o.ids[0] === orderId);
    setMyOrders([{...acceptedOrder, status: 'accepted'}]);
    setPendingOrders([]);
    setMainTab('my_trips'); 
    setDriverTab('active');
  };

  const handleLogout = () => { stopAlertSound(); localStorage.removeItem('userInfo'); navigate('/login'); };

  const renderOrderCard = (order, isHistory) => {
    const driverEarnings = order.calculated_price * 0.8;
    return (
      <div 
          key={order.ids[0]} 
          className="logistics-card overflow-hidden p-0 shadow-sm transition-hover"
          style={{ cursor: 'pointer', border: '1px solid var(--border-color)', opacity: isHistory ? 0.8 : 1 }}
          onClick={() => navigate(`/order/${order.ids[0]}`)}
      >
        <div className="p-3 border-bottom" style={{ borderColor: 'var(--border-color)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
          <div className="d-flex justify-content-between align-items-center mb-1">
            <h5 className="text-danger fw-bold mb-0">Mã: #{order.id}</h5>
            <Badge bg="success" className="px-2 py-1">{isHistory ? 'Đã hoàn thành' : 'Đang xử lý'}</Badge>
          </div>
          <div className="text-white fw-bold fs-5 mt-1">{driverEarnings.toLocaleString()}đ</div>
        </div>
        <div className="p-3 position-relative">
           <div className="d-flex mb-4">
              <div className="me-3 mt-1"><div style={{width:'14px', height:'14px', borderRadius:'50%', backgroundColor: '#FF4D4D'}}></div></div>
              <div className="flex-grow-1">
                 <div className="text-muted fw-bold">Điểm Lấy:</div>
                 <div className="text-white mb-2 fw-bold">{order.pickup}</div>
              </div>
           </div>
           <div className="d-flex position-relative">
              <div className="me-3 mt-1"><div style={{width:'14px', height:'14px', borderRadius:'50%', backgroundColor: '#4ADE80'}}></div></div>
              <div className="flex-grow-1">
                 <div className="text-muted fw-bold">Điểm Giao:</div>
                 <div className="text-white mb-2 fw-bold">{order.dropoff}</div>
              </div>
           </div>
        </div>
      </div>
    );
  };

  return (
    <Container fluid className="py-5" style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh' }}>
      <Container style={{ maxWidth: '900px' }}>
        
        {/* HEADER */}
        <div className="logistics-card p-4 mb-4 d-flex justify-content-between align-items-center flex-wrap" style={{ borderTop: '4px solid var(--brand-orange)' }}>
          <div className="d-flex align-items-center mb-3 mb-md-0">
            <div style={{width: '60px', height: '60px', borderRadius: '12px', backgroundColor: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '15px', fontSize: '24px', border: '1px solid var(--border-color)'}}>🛵</div>
            <div>
              <h5 className="mb-1 fw-bold text-white">{userInfo?.name}</h5>
              <div className="d-flex align-items-center gap-2">
                <Badge bg="dark" className="border border-secondary text-white px-2 py-1">XE MÁY</Badge>
                <Badge bg="success" className="px-2 py-1 cursor-pointer fw-bold border border-success" onClick={() => navigate('/wallet')}>💰 500.000đ</Badge>
              </div>
            </div>
          </div>
          <Button variant="outline-danger" onClick={handleLogout}>Thoát</Button>
        </div>

        {/* NÚT ONLINE/OFFLINE */}
        <div className="logistics-card p-4 mb-4 text-center">
            <h6 className="text-muted text-uppercase fw-bold mb-3 tracking-wide" style={{ fontSize: '13px' }}>TRẠNG THÁI HOẠT ĐỘNG</h6>
            <div className="d-flex justify-content-center">
                <Button className={`fw-bold px-5 py-3 ${isReady ? 'btn-orange shadow-lg' : 'btn-secondary text-white'}`} style={{ borderRadius: '30px', border: 'none', minWidth: '280px', backgroundColor: isReady ? 'var(--brand-orange)' : '#333' }} onClick={handleToggleReady}>
                    {isReady ? '🟢 ĐANG NHẬN ĐƠN (ONLINE)' : '😴 ĐANG NGHỈ NGƠI (OFFLINE)'}
                </Button>
            </div>
        </div>

        {/* TABS ĐIỀU HƯỚNG */}
        <div className="logistics-card mb-4 p-2 border-0">
            <Nav variant="pills" className="justify-content-center gap-2" activeKey={mainTab} onSelect={(k) => setMainTab(k)}>
              <Nav.Item><Nav.Link eventKey="radar" className={`fw-bold text-uppercase px-4 ${mainTab === 'radar' ? 'btn-orange text-white' : 'text-muted'}`}>📡 Bắt Đơn Mới</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="my_trips" className={`fw-bold text-uppercase px-4 ${mainTab === 'my_trips' ? 'btn-orange text-white' : 'text-muted'}`}>🏍️ Chuyến Của Tôi</Nav.Link></Nav.Item>
            </Nav>
        </div>
        
        {/* NỘI DUNG TAB RADAR */}
        {mainTab === 'radar' && (
          <div className="mt-2">
            {isReady && (
              <div className="logistics-card p-3 mb-4" style={{ border: '1px solid var(--border-color)', borderRadius: '16px', overflow: 'hidden' }}>
                <h6 className="fw-bold text-white mb-3">📡 RADAR QUÉT ĐƠN (1.5KM)</h6>
                <div style={{ height: '250px', width: '100%', borderRadius: '12px', overflow: 'hidden' }}>
                  <MapContainer center={[driverLocation.lat, driverLocation.lng]} zoom={14} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                    <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                    <Marker position={[driverLocation.lat, driverLocation.lng]}><Popup>Vị trí của bạn</Popup></Marker>
                    <Circle center={[driverLocation.lat, driverLocation.lng]} radius={1500} pathOptions={{ color: '#FF6633', fillColor: '#FF6633', fillOpacity: 0.15, weight: 2 }} />
                  </MapContainer>
                </div>
              </div>
            )}
            
            <h5 className="fw-bold text-white mb-3">📡 ĐƠN HÀNG MỚI XUNG QUANH</h5>
            {!isReady ? (
              <div className="logistics-card p-5 text-center text-muted fw-bold border-dashed" style={{ borderStyle: 'dashed' }}>Vui lòng bật trạng thái Đang Nhận Đơn để quét chuyến.</div>
            ) : pendingOrders.length === 0 ? (
              <div className="logistics-card p-5 text-center text-muted fw-bold">Hệ thống Radar đang quét tìm khách...</div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {pendingOrders.map((order, idx) => (
                  <div key={idx} className="logistics-card p-4" style={{ borderLeft: '4px solid #4ADE80' }}>
                    <div className="d-flex justify-content-between align-items-center flex-wrap">
                      <div className="mb-3 mb-md-0" style={{ maxWidth: '600px' }}>
                        <h6 className="fw-bold text-white mb-3">Mã: #{order.id}</h6>
                        <div className="text-muted fs-6">
                           <div className="mb-1"><strong>📍 Lấy:</strong> <span className="text-white">{order.pickup}</span></div>
                           <div><strong>🚩 Giao:</strong> <span className="text-white">{order.dropoff}</span></div>
                        </div>
                      </div>
                      <div className="text-end">
                        <h3 className="fw-bold mb-3" style={{ color: '#4ADE80' }}>{order.calculated_price.toLocaleString()} đ</h3>
                        <Button className="btn-orange px-4 fw-bold" onClick={() => handleAcceptOrder(order.ids[0])}>🤝 CHỐT ĐƠN</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* NỘI DUNG TAB CHUYẾN ĐI CỦA TÔI */}
        {mainTab === 'my_trips' && (
          <div className="mt-2">
            <Nav variant="pills" className="gap-2 mb-4" activeKey={driverTab} onSelect={(k) => setDriverTab(k)}>
              <Nav.Item><Nav.Link eventKey="active" className={`fw-bold px-3 py-1 ${driverTab === 'active' ? 'btn-orange text-white' : 'text-muted border'}`} style={{ borderRadius: '20px', borderColor: 'var(--border-color)', fontSize: '13px' }}>Đang chạy</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="history" className={`fw-bold px-3 py-1 ${driverTab === 'history' ? 'btn-orange text-white' : 'text-muted border'}`} style={{ borderRadius: '20px', borderColor: 'var(--border-color)', fontSize: '13px' }}>Lịch sử</Nav.Link></Nav.Item>
            </Nav>
            
            {driverTab === 'active' && (
               myOrders.length === 0 ? <div className="logistics-card p-4 text-center text-muted fw-bold">Bạn chưa nhận chuyến xe nào.</div>
               : <div className="d-flex flex-column gap-3">{myOrders.map(o => renderOrderCard(o, false))}</div>
            )}
          </div>
        )}

        {/* POPUP NỔ ĐƠN TOÀN MÀN HÌNH */}
        <Modal show={showIncomingPopup} onHide={() => {}} backdrop="static" centered size="lg" contentClassName="border-0 bg-transparent">
           <div className="p-1 rounded-4 shadow-lg" style={{ background: 'linear-gradient(45deg, #FF4D4D, #FF6633, #4ADE80)', animation: 'pulse-border 1.5s infinite' }}>
             <div className="logistics-card p-4 p-md-5 text-center rounded-4 border-0">
               <h2 className="fw-bold mb-4 text-white">🚨 CÓ ĐƠN HÀNG MỚI! 🚨</h2>
               {incomingOrder && (
                 <div className="bg-dark p-4 rounded-3 mb-4 border" style={{ borderColor: 'var(--border-color)' }}>
                   <div className="d-flex flex-column align-items-center mb-4">
                       <div className="text-muted fw-bold mb-2">ĐIỂM LẤY HÀNG</div>
                       <h5 className="text-white fw-bold px-3">{incomingOrder.pickup}</h5>
                       <div className="my-3 text-warning fs-3">⬇</div>
                       <div className="text-muted fw-bold mb-2">ĐIỂM GIAO HÀNG</div>
                       <h5 className="text-white fw-bold px-3">{incomingOrder.dropoff}</h5>
                   </div>
                   <div className="border-top pt-4" style={{ borderColor: 'var(--border-color) !important' }}>
                      <div className="text-muted fw-bold mb-1">THU NHẬP DỰ KIẾN</div>
                      <div className="fw-bold" style={{ fontSize: '3.5rem', color: '#4ADE80' }}>{(incomingOrder.calculated_price * 0.8).toLocaleString()} đ</div>
                   </div>
                 </div>
               )}
               <Row className="g-3 justify-content-center">
                 <Col xs={12} md={5}>
                    <Button variant="outline-light" size="lg" className="w-100 fw-bold py-3" onClick={() => { stopAlertSound(); setShowIncomingPopup(false); setPendingOrders([]); }}>BỎ QUA</Button>
                 </Col>
                 <Col xs={12} md={7}>
                    <Button size="lg" className="btn-orange fw-bold py-3 w-100 fs-4 shadow-lg" onClick={() => { stopAlertSound(); setShowIncomingPopup(false); handleAcceptOrder(incomingOrder.id); }}>🤝 NHẬN CUỐC NGAY</Button>
                 </Col>
               </Row>
             </div>
           </div>
        </Modal>
      </Container>
    </Container>
  );
}