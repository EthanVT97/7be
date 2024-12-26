import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const AdminDashboard: React.FC = () => {
  return (
    <Container className="py-4">
      <h1 className="mb-4">Admin Dashboard</h1>
      <Row>
        <Col md={6} lg={3} className="mb-4">
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Total Users</Card.Title>
              <h2>1,234</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3} className="mb-4">
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Total Bets</Card.Title>
              <h2>5,678</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3} className="mb-4">
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Total Revenue</Card.Title>
              <h2>1,000,000</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3} className="mb-4">
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Active Users</Card.Title>
              <h2>456</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={6} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Recent Transactions</Card.Title>
              {/* Add transaction table or list here */}
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Latest Results</Card.Title>
              {/* Add results table or list here */}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard; 