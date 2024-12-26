import React from 'react';
import { Container, Table, Card } from 'react-bootstrap';

const Transactions: React.FC = () => {
  return (
    <Container className="py-4">
      <h1 className="mb-4">Transactions</h1>
      <Card>
        <Card.Body>
          <Table responsive striped hover>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Reference</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2024-01-01</td>
                <td>Deposit</td>
                <td>1000</td>
                <td>Completed</td>
                <td>DEP123456</td>
              </tr>
              <tr>
                <td>2024-01-01</td>
                <td>Bet</td>
                <td>100</td>
                <td>Completed</td>
                <td>BET123456</td>
              </tr>
              <tr>
                <td>2024-01-02</td>
                <td>Withdrawal</td>
                <td>500</td>
                <td>Pending</td>
                <td>WIT123456</td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Transactions; 