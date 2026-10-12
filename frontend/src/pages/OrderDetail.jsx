import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Badge, Button, Form, Modal } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import SwipeButton from '../components/SwipeButton';
import OrderChatBox from '../components/OrderChatBox';

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const userInfoString = localStorage.getItem('userInfo');
  const userInfo = userInfoString ? JSON.parse(userInfoString) : null;

  const isDriverOwner = userInfo?.role?.startsWith('driver');
  const isAdmin = userInfo?.role === 'admin';

  // Dữ liệu giả lập
  const [orderState, setOrderState] = useState('accepted'); // pending -> accepted -> arrived_pickup -> picking_up -> delivering -> completed
  const [showPodModal, setShowPodModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Xử lý vuốt
  const handleUpdateStatus = (newStatus) => {
    setOrderState(newStatus);
    if (newStatus === 'completed' && userInfo?.role === 'customer') {
        setShowReviewModal(true); // Nếu khách hàng đang xem, đơn giao xong thì gợi ý đánh giá
    }
  };

  const handleCompleteWithPod = (e) => {
    e.preventDefault();
    setShowPodModal(false);
    handleUpdateStatus('completed');
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'accepted': return <Badge bg="info" className="px-2 py-1 text-dark">Tài xế đang đến</Badge>;
      case 'arrived_pickup': return <Badge bg="primary" className="px-2 py-1">Đã tới điểm lấy</Badge>;
      case 'picking_up': return <Badge bg="warning" className="px-2 py-1 text-dark">Đã lấy hàng</Badge>;
      case 'delivering': return <Badge bg="danger" className="px-2 py-1">Đang giao</Badge>;
      case 'completed': return <Badge bg="success" className="px-2 py-1">Đã hoàn thành</Badge>;
      default: return <Badge bg="secondary" className="px-2 py-1">{status}</Badge>;
    }
  };

  return (
    <Container fluid className="py-5" style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh' }}>
      <Container style={{ maxWidth: '1400px' }}>
        
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="mb-0 fw-bold" style={{ color: 'var(--brand-orange)' }}>🏷️ Chi tiết đơn hàng #{id || '101'}</h3>
          <Button variant="outline-light" onClick={() => navigate(isAdmin ? '/admin' : '/dashboard')}>⬅ Quay lại</Button>
        </div>

        {/* THANH TIẾN TRÌNH */}
        <div className="logistics-card mb-4 p-4 text-center">
          <h6 className="fw-bold text-muted mb-4 text-uppercase tracking-wide">Tiến trình vận đơn</h6>
          <div className="d-flex justify-content-between align-items-center position-relative mx-auto" style={{ maxWidth: '800px' }}>
              <div style={{ position: 'absolute', top: '50%', left: '10%', right: '10%', height: '4px', background: 'var(--border-color)', zIndex: 0 }}></div>
              <Badge bg={['arrived_pickup', 'picking_up', 'delivering', 'completed'].includes(orderState) ? "success" : "secondary"} className="p-3 rounded-circle position-relative z-index-1" style={{ width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', backgroundColor: ['arrived_pickup', 'picking_up', 'delivering', 'completed'].includes(orderState) ? 'var(--brand-orange) !important' : 'var(--border-color)' }}>1</Badge>
              <Badge bg={['delivering', 'completed'].includes(orderState) ? "success" : ['arrived_pickup', 'picking_up'].includes(orderState) ? "warning" : "secondary"} text="dark" className="p-3 rounded-circle position-relative z-index-1 border border-dark" style={{ width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', backgroundColor: ['delivering', 'completed'].includes(orderState) ? 'var(--brand-orange) !important' : '' }}>2</Badge>
              <Badge bg={orderState === 'completed' ? "success" : orderState === 'delivering' ? "primary" : "secondary"} text="light" className="p-3 rounded-circle position-relative z-index-1 border border-dark" style={{ width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', backgroundColor: orderState === 'completed' ? 'var(--brand-orange) !important' : '' }}>3</Badge>
          </div>
        </div>

        <Row className="g-4 align-items-stretch">
          <Col lg={7} xl={8} className="d-flex flex-column gap-4">
            
            {/* LỘ TRÌNH CÔNG VIỆC */}
            <div className="logistics-card overflow-hidden">
              <div className="text-white border-bottom py-3 px-4 d-flex align-items-center" style={{ backgroundColor: 'var(--brand-orange)', borderColor: 'var(--border-color) !important' }}>
                <h5 className="mb-0 fw-bold text-dark">📦 Lộ Trình Công Việc (Demo)</h5>
              </div>
              <div className="p-4">
                
                <h6 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: '#FF4D4D' }}><span className="fs-5">📍</span> NHIỆM VỤ LẤY HÀNG</h6>
                <div className="p-3 mb-4 rounded border" style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color) !important', borderLeft: '4px solid #FF4D4D !important' }}>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <strong className="text-white fs-5">Mã #{id || '101'}</strong>
                    {getStatusBadge(orderState)}
                  </div>
                  <div className="mb-3 text-muted"><strong>Địa chỉ:</strong> <span className="text-white">Trường Đại học Sài Gòn</span></div>
                  
                  {isDriverOwner && !['completed'].includes(orderState) && (
                    <div className="mt-3">
                      {orderState === 'accepted' && (
                         <SwipeButton text="Quẹt xác nhận: Đã tới điểm đến" colorClass="danger" onComplete={() => handleUpdateStatus('arrived_pickup')} />
                      )}
                      {orderState === 'arrived_pickup' && (
                         <SwipeButton text="Quẹt xác nhận: Đã lấy hàng" colorClass="danger" onComplete={() => handleUpdateStatus('picking_up')} />
                      )}
                    </div>
                  )}
                </div>

                <hr className="my-4" style={{ borderColor: 'var(--border-color)' }} />

                <h6 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: '#4ADE80' }}><span className="fs-5">🚩</span> NHIỆM VỤ GIAO HÀNG</h6>
                <div className="p-3 mb-4 rounded border" style={{ backgroundColor: 'var(--bg-input)', borderColor: 'var(--border-color) !important', borderLeft: '4px solid #4ADE80 !important' }}>
                  <div className="mb-2 text-muted"><strong>Địa chỉ:</strong> <span className="text-white">Landmark 81, Bình Thạnh</span></div>
                  
                  {isDriverOwner && ['picking_up', 'delivering'].includes(orderState) && (
                    <div className="mt-3">
                      {orderState === 'picking_up' && (
                         <SwipeButton text="Quẹt xác nhận: Đã tới điểm giao" colorClass="success" onComplete={() => handleUpdateStatus('delivering')} />
                      )}
                      {orderState === 'delivering' && (
                         <SwipeButton text="Quẹt xác nhận: Hoàn thành đơn" colorClass="success" onComplete={() => setShowPodModal(true)} />
                      )}
                    </div>
                  )}
                </div>

              </div>
            </div>
            
          </Col>

          {/* CỘT PHẢI: KHUNG CHAT */}
          <Col lg={5} xl={4} className="d-flex flex-column">
             <div className="h-100">
                <OrderChatBox userInfo={userInfo} isChatDisabled={orderState === 'completed'} />
             </div>
          </Col>
        </Row>

        {/* MODALS */}
        <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)} centered contentClassName="logistics-card border-0">
          <Modal.Header closeButton className="border-bottom" style={{ borderColor: 'var(--border-color)' }}>
            <Modal.Title className="fw-bold text-white">🎉 Chuyến đi hoàn tất!</Modal.Title>
          </Modal.Header>
          <Form onSubmit={(e) => { e.preventDefault(); alert("Cảm ơn bạn đã đánh giá!"); setShowReviewModal(false); }}>
            <Modal.Body className="text-center p-4">
              <h5 className="mb-4 text-white">Tài xế phục vụ bạn thế nào?</h5>
              <div className="mb-4 fs-1" style={{ cursor: 'pointer' }}>
                <span style={{ color: '#ffc107', margin: '0 5px' }}>★</span>
                <span style={{ color: '#ffc107', margin: '0 5px' }}>★</span>
                <span style={{ color: '#ffc107', margin: '0 5px' }}>★</span>
                <span style={{ color: '#ffc107', margin: '0 5px' }}>★</span>
                <span style={{ color: '#ffc107', margin: '0 5px' }}>★</span>
              </div>
            </Modal.Body>
            <Modal.Footer className="justify-content-center border-top" style={{ borderColor: 'var(--border-color)' }}>
              <Button type="submit" className="btn-orange px-5 py-2 fw-bold w-100">Gửi Đánh Giá Ngay</Button>
            </Modal.Footer>
          </Form>
        </Modal>

        <Modal show={showPodModal} onHide={() => setShowPodModal(false)} centered backdrop="static" contentClassName="logistics-card border-0">
          <Modal.Header closeButton className="border-bottom" style={{ borderColor: 'var(--border-color)' }}>
            <Modal.Title className="fw-bold text-white">📸 CHỤP ẢNH BẰNG CHỨNG GIAO HÀNG</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleCompleteWithPod}>
            <Modal.Body className="text-center p-4">
              <Form.Control type="file" className="logistics-input" accept="image/*" capture="environment" required />
            </Modal.Body>
            <Modal.Footer className="justify-content-center border-top" style={{ borderColor: 'var(--border-color)' }}>
              <Button variant="success" type="submit" className="fw-bold px-5">📤 HOÀN THÀNH</Button>
            </Modal.Footer>
          </Form>
        </Modal>

      </Container>
    </Container>
  );
}