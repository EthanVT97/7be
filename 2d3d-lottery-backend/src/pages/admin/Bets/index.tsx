import React from 'react';
import { Container, Table, Card, Form, Button } from 'react-bootstrap';

const AdminBets: React.FC = () => {
  return (
    <Container className="py-4">
      <h1 className="mb-4">Manage Bets</h1>
      <Card className="mb-4">
        <Card.Body>
          <Form className="row g-3">
            <div className="col-md-3">
              <Form.Group>
                <Form.Label>Game Type</Form.Label>
                <Form.Select>
                  <option value="">All</option>
                  <option value="2d">2D</option>
                  <option value="3d">3D</option>
                </Form.Select>
              </Form.Group>
            </div>
            <div className="col-md-3">
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Select>
                  <option value="">All</option>
                  <option value="pending">Pending</option>
                  <option value="won">Won</option>
                  <option value="lost">Lost</option>
                </Form.Select>
              </Form.Group>
            </div>
            <div className="col-md-3">
              <Form.Group>
                <Form.Label>Date Range</Form.Label>
                <Form.Control type="date" />
              </Form.Group>
            </div>
            <div className="col-md-3">
              <Form.Group>
                <Form.Label>&nbsp;</Form.Label>
                <Button variant="primary" className="w-100" type="submit">
                  Filter
                </Button>
              </Form.Group>
            </div>
          </Form>
        </Card.Body>
      </Card>
      <Card>
        <Card.Body>
          <Table responsive striped hover>
            <thead>
              <tr>
                <th>Date</th>
                <th>User</th>
                <th>Game</th>
                <th>Numbers</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2024-01-01</td>
                <td>user123</td>
                <td>2D</td>
                <td>25</td>
                <td>1000</td>
                <td>Pending</td>
                <td>
                  <Button variant="info" size="sm" className="me-2">View</Button>
                  <Button variant="danger" size="sm">Cancel</Button>
                </td>
              </tr>
              {/* Add more rows as needed */}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminBets; 