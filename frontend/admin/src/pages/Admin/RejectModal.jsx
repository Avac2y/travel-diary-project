import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function RejectModal({ show, onClose, onConfirm, post }) {
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (show) setReason('');
  }, [show]);

  const handleConfirm = () => {
    if (post) {
      onConfirm(post._id, reason);
    }
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>拒绝理由</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>请填写拒绝原因：</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>取消</Button>
        <Button variant="danger" onClick={handleConfirm}>确认拒绝</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default RejectModal;
