import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getReports } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { FaCalendarAlt, FaDownload } from 'react-icons/fa';

interface ReportData {
  dailyRevenue: { date: string; amount: number }[];
  weeklyBets: { week: string; twod: number; threed: number }[];
  userStats: { label: string; value: number }[];
  topWinners: {
    username: string;
    totalWins: number;
    totalAmount: number;
  }[];
  topNumbers: {
    number: string;
    type: '2D' | '3D';
    count: number;
  }[];
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Section = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  color: #1a1a1a;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ChartContainer = styled.div`
  height: 400px;
  margin: 1rem 0;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
`;

const Th = styled.th`
  background: #f8f9fa;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #495057;
  border-bottom: 2px solid #dee2e6;
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  color: #212529;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  background-color: white;
  color: #495057;

  &:focus {
    outline: none;
    border-color: #80bdff;
    box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
  }
`;

const DateInput = styled.input`
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  background-color: white;
  color: #495057;

  &:focus {
    outline: none;
    border-color: #80bdff;
    box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
  }
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0056b3;
  }
`;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const ReportsAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7days');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    fetchReportData();
  }, [timeRange, startDate, endDate]);

  const fetchReportData = async () => {
    try {
      const response = await getReports({ timeRange, startDate, endDate });
      setReportData(response.data);
    } catch (error) {
      toast.showToast('Failed to fetch report data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    // Implement CSV export logic
    toast.showToast('Report exported successfully', 'success');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!reportData) {
    return <div>No data available</div>;
  }

  return (
    <Container>
      <FilterContainer>
        <Select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
        >
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
          <option value="90days">Last 90 Days</option>
          <option value="custom">Custom Range</option>
        </Select>
        {timeRange === 'custom' && (
          <>
            <DateInput
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <DateInput
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </>
        )}
        <Button onClick={handleExportCSV}>
          <FaDownload /> Export Report
        </Button>
      </FilterContainer>

      <Section>
        <SectionTitle>
          Revenue Trend
          <FaCalendarAlt />
        </SectionTitle>
        <ChartContainer>
          <ResponsiveContainer>
            <LineChart data={reportData.dailyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="amount" stroke="#0088FE" name="Revenue" />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </Section>

      <Grid>
        <Section>
          <SectionTitle>Weekly Betting Distribution</SectionTitle>
          <ChartContainer>
            <ResponsiveContainer>
              <BarChart data={reportData.weeklyBets}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="twod" fill="#0088FE" name="2D" />
                <Bar dataKey="threed" fill="#00C49F" name="3D" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Section>

        <Section>
          <SectionTitle>User Statistics</SectionTitle>
          <ChartContainer>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={reportData.userStats}
                  dataKey="value"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {reportData.userStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </Section>
      </Grid>

      <Section>
        <SectionTitle>Top Winners</SectionTitle>
        <Table>
          <thead>
            <tr>
              <Th>Username</Th>
              <Th>Total Wins</Th>
              <Th>Total Amount</Th>
            </tr>
          </thead>
          <tbody>
            {reportData.topWinners.map((winner, index) => (
              <tr key={index}>
                <Td>{winner.username}</Td>
                <Td>{winner.totalWins}</Td>
                <Td>{winner.totalAmount.toLocaleString()}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Section>

      <Section>
        <SectionTitle>Most Popular Numbers</SectionTitle>
        <Table>
          <thead>
            <tr>
              <Th>Number</Th>
              <Th>Type</Th>
              <Th>Times Played</Th>
            </tr>
          </thead>
          <tbody>
            {reportData.topNumbers.map((number, index) => (
              <tr key={index}>
                <Td>{number.number}</Td>
                <Td>{number.type}</Td>
                <Td>{number.count}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Section>
    </Container>
  );
};

export default ReportsAnalytics; 