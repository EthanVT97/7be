import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AppBar, Toolbar, Typography, Button, Container, Box, CssBaseline } from '@mui/material';
import Login from './components/auth/Login';
import Profile from './components/user/Profile';
import BettingForm from './components/lottery/BettingForm';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: [
      'Myanmar3',
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

const App: React.FC = () => {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
              2D3D Lottery
            </Typography>
            {isAuthenticated ? (
              <>
                <Button color="inherit" component={Link} to="/profile">
                  ပရိုဖိုင်
                </Button>
                <Button color="inherit" onClick={() => {
                  localStorage.removeItem('token');
                  window.location.href = '/login';
                }}>
                  ထွက်မည်
                </Button>
              </>
            ) : (
              <Button color="inherit" component={Link} to="/login">
                ဝင်ရောက်ရန်
              </Button>
            )}
          </Toolbar>
        </AppBar>

        <Container>
          <Box sx={{ mt: 4 }}>
            <Routes>
              <Route path="/" element={isAuthenticated ? <BettingForm /> : <Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={isAuthenticated ? <Profile /> : <Login />} />
              <Route path="/bet" element={isAuthenticated ? <BettingForm /> : <Login />} />
            </Routes>
          </Box>
        </Container>
      </Router>
    </ThemeProvider>
  );
};

export default App; 