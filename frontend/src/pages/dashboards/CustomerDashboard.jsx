import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Button, Badge, ProgressBar, Modal, Form, InputGroup } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);

  // STATE CHAT TRỰC TIẾP GIỮA KHÁCH VÀ TÀI XẾ
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'driver', text: 'Chào bạn, mình đang di chuyển tới điểm lấy hàng nhé!' },
    { sender: 'customer', text: 'Dạ ok bạn, đến nơi cứ gọi số điện thoại trên đơn nhé.' }
  ]);
  const chatEndRef = useRef(null);

  const userInfoString = localStorage.getItem('userInfo');
  const userInfo = userInfoString ? JSON.parse(userInfoString) : { role: 'customer' };
  const isDriver = userInfo?.role?.startsWith('driver');

  // MOCKUP DỮ LIỆU ĐƠN HÀNG DEMO
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setOrder({
        id: id || '101',
        serviceType: 'express',
        serviceName: 'Xe máy giao nhanh',
        status: 'accepted', // Các trạng thái: pending -> accepted -> delivering -> completed
        pickup: 'Đại học Sài Gòn, 273 An Dương Vương, Q.5, TP.HCM',
        dropoff: 'Landmark 81, 720A Điện Biên Phủ, Bình Thạnh, TP.HCM',
        senderName: 'Nguyễn Quang Đạt',
        senderPhone: '0868923294',
        receiverName: 'Trần Thị B',
        receiverPhone: '0909123456',
        packageDetails: 'Tài liệu & Quà tặng (Dưới 5kg)',
        distance: 8.5,
        basePrice: 55000,
        extraFee: 10000,
        totalPrice: 65000,
        driverEarning: 52000,
        paymentMethod: 'Tiền mặt khi nhận hàng',
        driver: {
          name: 'Nguyễn Văn Tài (Xế Partner)',
          phone: '0912345678',
          licensePlate: '51H-264.39',
          rating: '4.9 ⭐'
        },
        createdAt: '28/10/2026 14:30'
      });
      setLoading(false);
    }, 400);
  }, [id]);

  useEffect(() => {
    if (showChatModal) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, showChatModal]);

  const handleBack = () => {
    if (userInfo?.role === 'admin') navigate('/admin');
    else if (isDriver) navigate('/driver');
    else navigate('/guest');
  };

  const handleNextStatus = () => {
    if (!order) return;
    let nextStatus = order.status;
    if (order.status === 'accepted') nextStatus = 'arrived_pickup';
    else if (order.status === 'arrived_pickup') nextStatus = 'delivering';
    else if (order.status === 'delivering') nextStatus = 'completed';

    setOrder(prev => ({ ...prev, status: nextStatus }));
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const currentSender = isDriver ? 'driver' : 'customer';
    setChatMessages(prev => [...prev, { sender: currentSender, text: chatInput }]);
    setChatInput('');
  };

  const openGoogleMaps = (address) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank');
  };

  if (loading) return (
    <Container fluid className="py-5 text-center text-muted" style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh' }}>
      <h4>Đang tải chi tiết đơn hàng #{id}...</h4>
    </Container>
  );

  if (!order) return (
    <Container fluid className="py-5 text-center text-white" style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh' }}>
      <h3>Không tìm thấy đơn hàng #{id}</h3>
      <Button className="btn-orange mt-3" onClick={handleBack}>Quay về</Button>
    </Container>
  );

  // =========================================================================
  // GIAO DIỆN 1: MÀN HÌNH TÁC NGHIỆP CỦA TÀI XẾ (DRIVER VIEW)
  // =========================================================================
  if (isDriver) {
    return (
      <Container fluid className="py-2 py-md-4" style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh' }}>
        <div style={{ maxWidth: '440px', margin: '0 auto' }}>
          
          <div className="logistics-card p-3 mb-3 d-flex justify-content-between align-items-center" style={{ borderTop: '4px solid var(--brand-orange)' }}>
            <Button variant="outline-light" size="sm" style={{ borderColor: 'var(--border-color)', fontSize: '12px' }} onClick={handleBack}>
              ⬅ Quay lại
            </Button>
            <span className="fw-bold text-white fs-6">Đơn hàng #{order.id}</span>
            <Button variant="outline-warning" size="sm" style={{ fontSize: '12px' }} onClick={() => setShowChatModal(true)}>
              💬 Chat Khách
            </Button>
          </div>

          <div className="logistics-card p-3 mb-3" style={{ border: '1px solid #4ADE80', backgroundColor: 'rgba(74, 222, 128, 0.05)' }}>
            <Row className="text-center align-items-center g-2">
              <Col xs={6} className="border-end" style={{ borderColor: 'var(--border-color)' }}>
                <small className="text-muted d-block fw-bold" style={{ fontSize: '11px' }}>THU NHẬP THỰC NHẬN</small>
                <h4 className="fw-bold mb-0" style={{ color: '#4ADE80' }}>{order.driverEarning.toLocaleString()}đ</h4>
              </Col>
              <Col xs={6}>
                <small className="text-muted d-block fw-bold" style={{ fontSize: '11px' }}>THANH TOÁN</small>
                <h5 className="fw-bold mb-0 text-warning">{order.paymentMethod}</h5>
              </Col>
            </Row>
          </div>

          <div className="logistics-card p-3 mb-3 border-start border-4 border-info">
            <small className="text-muted fw-bold d-block mb-2" style={{ fontSize: '11px' }}>KHÁCH HÀNG ĐẶT ĐƠN</small>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div>
                <h6 className="text-white fw-bold mb-0">{order.senderName}</h6>
                <small className="text-muted">📞 {order.senderPhone}</small>
              </div>
              <div className="d-flex gap-2">
                <a href={`tel:${order.senderPhone}`} className="btn btn-sm btn-outline-success fw-bold px-3 py-1">📞 Gọi</a>
                <Button size="sm" className="btn-orange fw-bold py-1" onClick={() => setShowChatModal(true)}>💬 Chat</Button>
              </div>
            </div>
            <div className="pt-2 border-top text-muted" style={{ borderColor: 'var(--border-color)', fontSize: '12px' }}>
              <strong>Ghi chú:</strong> {order.packageDetails}
            </div>
          </div>

          <div className="logistics-card p-3 mb-4">
            <h6 className="text-white fw-bold mb-3" style={{ fontSize: '13px' }}>📍 LỘ TRÌNH TÁC NGHIỆP</h6>
            <div className="mb-3 position-relative pb-3 border-bottom" style={{ borderColor: 'var(--border-color)' }}>
              <div className="d-flex justify-content-between align-items-start mb-1">
                <small className="text-danger fw-bold" style={{ fontSize: '11px' }}>1. ĐIỂM LẤY HÀNG</small>
                <Button size="sm" variant="outline-light" style={{ fontSize: '11px', borderColor: 'var(--border-color)' }} onClick={() => openGoogleMaps(order.pickup)}>🗺️ Chỉ đường</Button>
              </div>
              <div className="text-white fw-bold" style={{ fontSize: '13px' }}>{order.pickup}</div>
            </div>

            <div>
              <div className="d-flex justify-content-between align-items-start mb-1">
                <small className="text-success fw-bold" style={{ fontSize: '11px' }}>2. ĐIỂM GIAO HÀNG</small>
                <Button size="sm" variant="outline-light" style={{ fontSize: '11px', borderColor: 'var(--border-color)' }} onClick={() => openGoogleMaps(order.dropoff)}>🗺️ Chỉ đường</Button>
              </div>
              <div className="text-white fw-bold" style={{ fontSize: '13px' }}>{order.dropoff}</div>
            </div>
          </div>

          <div className="position-sticky bottom-0 pb-3 pt-2" style={{ backgroundColor: 'var(--bg-main)' }}>
            {order.status === 'accepted' && (
              <Button className="btn-orange w-100 py-3 fw-bold fs-6 shadow-lg" onClick={handleNextStatus}>📍 ĐÃ TỚI ĐIỂM LẤY HÀNG</Button>
            )}
            {order.status === 'arrived_pickup' && (
              <Button className="btn-warning w-100 py-3 fw-bold fs-6 shadow-lg text-dark" onClick={handleNextStatus}>📦 ĐÃ LẤY HÀNG & BẮT ĐẦU GIAO</Button>
            )}
            {order.status === 'delivering' && (
              <Button variant="success" className="w-100 py-3 fw-bold fs-6 shadow-lg" onClick={handleNextStatus}>✅ HOÀN THÀNH CHUYẾN XE</Button>
            )}
            {order.status === 'completed' && (
              <Button variant="secondary" className="w-100 py-3 fw-bold fs-6" disabled>🎉 ĐƠN HÀNG ĐÃ HOÀN THÀNH</Button>
            )}
          </div>

          {/* MODAL CHAT */}
          <Modal show={showChatModal} onHide={() => setShowChatModal(false)} centered contentClassName="logistics-card border-0">
            <Modal.Header closeButton className="border-bottom" style={{ borderColor: 'var(--border-color)' }}>
              <Modal.Title className="fw-bold text-white fs-6">💬 Trao đổi với Khách hàng #{order.id}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-3">
              <div className="p-3 mb-3 rounded" style={{ height: '280px', overflowY: 'auto', backgroundColor: 'var(--bg-main)' }}>
                {chatMessages.map((msg, index) => (
                  <div key={index} className={`d-flex mb-2 ${msg.sender === 'driver' ? 'justify-content-end' : 'justify-content-start'}`}>
                    <div className={`p-2 px-3 rounded-3 ${msg.sender === 'driver' ? 'text-white' : 'text-white border'}`} style={{ backgroundColor: msg.sender === 'driver' ? 'var(--brand-orange)' : 'var(--bg-card)', borderColor: 'var(--border-color)', fontSize: '13px' }}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <Form onSubmit={handleSendMessage}>
                <InputGroup>
                  <Form.Control type="text" className="logistics-input" placeholder="Nhập tin nhắn..." value={chatInput} onChange={e => setChatInput(e.target.value)} />
                  <Button type="submit" className="btn-orange fw-bold">Gửi</Button>
                </InputGroup>
              </Form>
            </Modal.Body>
          </Modal>

        </div>
      </Container>
    );
  }

  // =========================================================================
  // GIAO DIỆN 2: MÀN HÌNH THEO DÕI CỦA KHÁCH HÀNG & ADMIN (CUSTOMER VIEW)
  // =========================================================================
  return (
    <Container fluid className="py-4 py-md-5" style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh' }}>
      <Container style={{ maxWidth: '950px' }}>
        
        {/* TOP BAR */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Button variant="outline-light" className="fw-bold px-3" style={{ borderColor: 'var(--border-color)' }} onClick={handleBack}>
            ⬅ Quay về
          </Button>
          <span className="text-muted fw-bold">Mã đơn: #{order.id}</span>
        </div>

        {/* TIẾN TRÌNH ĐƠN HÀNG */}
        <div className="logistics-card p-4 mb-4" style={{ borderTop: '4px solid var(--brand-orange)' }}>
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <div>
              <h4 className="text-white fw-bold mb-1">Theo dõi đơn hàng #{order.id}</h4>
              <small className="text-muted">Khởi tạo lúc: {order.createdAt}</small>
            </div>
            <Badge bg={order.status === 'completed' ? 'success' : order.status === 'delivering' ? 'warning' : 'info'} className="px-3 py-2 fs-6">
              {order.status.toUpperCase()}
            </Badge>
          </div>

          <div className="mt-4">
            <small className="text-muted d-block mb-2 fw-bold">Tiến trình vận chuyển</small>
            <ProgressBar animated={order.status === 'delivering'} variant="warning" now={order.status === 'completed' ? 100 : order.status === 'delivering' ? 75 : 50} style={{ height: '10px', backgroundColor: 'var(--bg-input)' }} />
          </div>
        </div>

        <Row className="g-4 mb-4">
          {/* CỘT TRÁI: LỘ TRÌNH GIAO HÀNG */}
          <Col md={7}>
            <div className="logistics-card p-4 h-100">
              <h5 className="text-white fw-bold mb-4">📍 Lộ trình giao hàng</h5>
              
              <div className="mb-4">
                <small className="text-muted d-block fw-bold mb-1">ĐIỂM LẤY HÀNG</small>
                <div className="text-white fw-bold fs-6">📍 {order.pickup}</div>
                <small className="text-muted">Người gửi: {order.senderName} ({order.senderPhone})</small>
              </div>

              <div className="mb-4">
                <small className="text-muted d-block fw-bold mb-1">ĐIỂM GIAO HÀNG</small>
                <div className="text-white fw-bold fs-6">🚩 {order.dropoff}</div>
                <small className="text-muted">Người nhận: {order.receiverName} ({order.receiverPhone})</small>
              </div>

              <div className="pt-3 border-top" style={{ borderColor: 'var(--border-color)' }}>
                <small className="text-muted d-block fw-bold mb-1">GHI CHÚ HÀNG HÓA</small>
                <span className="text-white">{order.packageDetails}</span>
              </div>
            </div>
          </Col>

          {/* CỘT PHẢI: THÔNG TIN TÀI XẾ VÀ CHI TIẾT CƯỚC PHÍ */}
          <Col md={5}>
            
            {/* 1. KHỐI THÔNG TIN TÀI XẾ PHỤ TRÁCH (ĐÃ BỔ SUNG) */}
            <div className="logistics-card p-4 mb-4 border-start border-4 border-info">
              <small className="text-muted fw-bold d-block mb-2 text-uppercase" style={{ fontSize: '11px' }}>Tài xế nhận chuyến</small>
              
              {order.driver && order.status !== 'pending' ? (
                <div>
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="rounded-circle d-flex justify-content-center align-items-center border" style={{ width: '48px', height: '48px', backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color)', fontSize: '20px' }}>
                      🛵
                    </div>
                    <div>
                      <h6 className="text-white fw-bold mb-0">{order.driver.name}</h6>
                      <small className="text-info fw-bold">{order.driver.licensePlate}</small>
                      <div className="text-warning fw-bold" style={{ fontSize: '12px' }}>{order.driver.rating}</div>
                    </div>
                  </div>

                  {/* NÚT LIÊN LẠC VỚI TÀI XẾ */}
                  <div className="d-flex gap-2 pt-2 border-top" style={{ borderColor: 'var(--border-color)' }}>
                    <a href={`tel:${order.driver.phone}`} className="btn btn-sm btn-outline-success fw-bold flex-grow-1 py-2">
                      📞 Gọi điện
                    </a>
                    <Button size="sm" className="btn-orange fw-bold flex-grow-1 py-2" onClick={() => setShowChatModal(true)}>
                      💬 Chat ngay
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-muted py-2 fst-italic">
                  🔍 Đang hệ thống ghép nối tài xế gần bạn nhất...
                </div>
              )}
            </div>

            {/* 2. CƯỚC PHÍ */}
            <div className="logistics-card p-4">
              <h6 className="text-muted fw-bold mb-3 text-uppercase" style={{ fontSize: '12px' }}>Chi tiết cước phí</h6>
              <div className="d-flex justify-content-between text-muted mb-2">
                <span>Cước vận chuyển ({order.distance} km)</span>
                <span className="text-white">{order.basePrice.toLocaleString()}đ</span>
              </div>
              <div className="d-flex justify-content-between text-muted mb-2">
                <span>Phụ phí dịch vụ</span>
                <span className="text-white">{order.extraFee.toLocaleString()}đ</span>
              </div>
              <hr style={{ borderColor: 'var(--border-color)' }} />
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-white fw-bold">TỔNG CƯỚC PHÍ</span>
                <h4 className="fw-bold mb-0" style={{ color: '#4ADE80' }}>{order.totalPrice.toLocaleString()}đ</h4>
              </div>
              <small className="text-muted d-block mt-2">Thanh toán: {order.paymentMethod}</small>
            </div>

          </Col>
        </Row>

        {/* MODAL CHAT CHO KHÁCH HÀNG */}
        <Modal show={showChatModal} onHide={() => setShowChatModal(false)} centered contentClassName="logistics-card border-0">
          <Modal.Header closeButton className="border-bottom" style={{ borderColor: 'var(--border-color)' }}>
            <Modal.Title className="fw-bold text-white fs-6">💬 Trao đổi với Tài xế #{order.id}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-3">
            <div className="p-3 mb-3 rounded" style={{ height: '280px', overflowY: 'auto', backgroundColor: 'var(--bg-main)' }}>
              {chatMessages.map((msg, index) => (
                <div key={index} className={`d-flex mb-2 ${msg.sender === 'customer' ? 'justify-content-end' : 'justify-content-start'}`}>
                  <div className={`p-2 px-3 rounded-3 ${msg.sender === 'customer' ? 'text-white' : 'text-white border'}`} style={{ backgroundColor: msg.sender === 'customer' ? 'var(--brand-orange)' : 'var(--bg-card)', borderColor: 'var(--border-color)', fontSize: '13px' }}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <Form onSubmit={handleSendMessage}>
              <InputGroup>
                <Form.Control type="text" className="logistics-input" placeholder="Nhập tin nhắn..." value={chatInput} onChange={e => setChatInput(e.target.value)} />
                <Button type="submit" className="btn-orange fw-bold">Gửi</Button>
              </InputGroup>
            </Form>
          </Modal.Body>
        </Modal>

      </Container>
    </Container>
  );
}