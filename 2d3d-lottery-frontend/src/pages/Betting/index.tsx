import React from 'react';
import { Container, Form, Button, Card, Row, Col } from 'react-bootstrap';

const Betting: React.FC = () => {
  return (
    <Container className="py-4">
      <h1 className="mb-4">Place Your Bet</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-4">
            <Card.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Select Game Type</Form.Label>
                  <Form.Select>
                    <option value="2d">2D Lottery</option>
                    <option value="3d">3D Lottery</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Numbers</Form.Label>
                  <Form.Control type="text" placeholder="Enter your numbers" />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Bet Amount</Form.Label>
                  <Form.Control type="number" placeholder="Enter bet amount" />
                </Form.Group>

                <Button variant="primary" type="submit">
                  Place Bet
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <h5>Betting Rules</h5>
              <ul>
                <li>Minimum bet: 100</li>
                <li>Maximum bet: 10000</li>
                <li>2D: Choose 2 numbers (00-99)</li>
                <li>3D: Choose 3 numbers (000-999)</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Betting; 