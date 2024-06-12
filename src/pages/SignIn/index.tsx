import React, { useState } from 'react';
import {
  Button,
  TextField,
  Grid,
  Paper,
  Typography,
  Container,
  Link as MuiLink,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (email === '' || password === '') {
      setError('All fields are required');
      return;
    }
    // Add authentication logic here
    console.log('Email:', email);
    console.log('Password:', password);
    setError('');
    // Navigate to another page after successful sign in
    navigate('/dashboard');
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={6} style={{ padding: '20px', marginTop: '50px' }}>
        <Typography component="h1" variant="h5">
          Sign In
        </Typography>
        <form onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>
            {error && (
              <Grid item xs={12}>
                <Typography color="error">{error}</Typography>
              </Grid>
            )}
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
              >
                Sign In
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" align="center">
                <MuiLink component={Link} to="../SignUp" variant="body2">
                  {"Don't have an account? Register"}
                </MuiLink>
              </Typography>
              <Typography variant="body2" align="center" style={{ marginTop: '10px' }}>

              </Typography>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default SignIn;
