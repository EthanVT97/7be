import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

const Profile: React.FC = () => {
  // TODO: Fetch from API
  const userBalance = 50000;
  const transactions = [
    { id: 1, type: 'deposit', amount: 10000, date: '2024-01-01' },
    { id: 2, type: 'bet', amount: -5000, date: '2024-01-02' },
    { id: 3, type: 'win', amount: 15000, date: '2024-01-03' },
  ];

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" mb={2}>
                <AccountBalanceWalletIcon sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h5">လက်ကျန်ငွေ</Typography>
              </Box>
              <Typography variant="h4" color="primary" gutterBottom>
                {userBalance.toLocaleString()} ကျပ်
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Button variant="contained" color="primary" sx={{ mr: 2 }}>
                  ငွေသွင်းမည်
                </Button>
                <Button variant="outlined" color="primary">
                  ငွေထုတ်မည်
                </Button>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                ငွေစာရင်းမှတ်တမ်း
              </Typography>
              <List>
                {transactions.map((transaction) => (
                  <React.Fragment key={transaction.id}>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Typography color={transaction.amount > 0 ? 'success.main' : 'error.main'}>
                            {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString()} ကျပ်
                          </Typography>
                        }
                        secondary={new Date(transaction.date).toLocaleDateString('my-MM')}
                      />
                      <Typography variant="body2" color="textSecondary">
                        {transaction.type === 'deposit' && 'ငွေသွင်း'}
                        {transaction.type === 'bet' && 'လောင်းကြေး'}
                        {transaction.type === 'win' && 'ထီပေါက်'}
                      </Typography>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Profile; 