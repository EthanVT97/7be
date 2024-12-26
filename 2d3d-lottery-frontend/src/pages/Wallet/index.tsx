import React from 'react';
import { Container, Card, Row, Col, Form, Button } from 'react-bootstrap';

const Wallet: React.FC = () => {
  return (
    <Container className="py-4">
      <h1 className="mb-4">Wallet</h1>
      <Row>
        <Col md={4} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Balance</Card.Title>
              <h2 className="text-primary">10,000 MMK</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          <Card className="mb-4">
            <Card.Body>
              <h5>Deposit</h5>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Amount</Form.Label>
                  <Form.Control type="number" placeholder="Enter amount" />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Payment Method</Form.Label>
                  <Form.Select>
                    <option value="kbzpay">KBZ Pay</option>
                    <option value="wavepay">Wave Pay</option>
                  </Form.Select>
                </Form.Group>
                <Button variant="primary" type="submit">
                  Deposit
                </Button>
              </Form>
            </Card.Body>
          </Card>
          <Card>
            <Card.Body>
              <h5>Withdraw</h5>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Amount</Form.Label>
                  <Form.Control type="number" placeholder="Enter amount" />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Payment Method</Form.Label>
                  <Form.Select>
                    <option value="kbzpay">KBZ Pay</option>
                    <option value="wavepay">Wave Pay</option>
                  </Form.Select>
                </Form.Group>
                <Button variant="secondary" type="submit">
                  Withdraw
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Wallet; 