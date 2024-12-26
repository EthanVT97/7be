import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const Dashboard: React.FC = () => {
  return (
    <Container className="py-4">
      <h1 className="mb-4">Dashboard</h1>
      <Row>
        <Col md={6} lg={4} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Recent Bets</Card.Title>
              <Card.Text>View your recent betting history</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={4} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Wallet Balance</Card.Title>
              <Card.Text>Check your current balance</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={4} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Latest Results</Card.Title>
              <Card.Text>View recent lottery results</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard; 