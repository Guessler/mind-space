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
import { authService } from '../../services/auth';

import { Paths } from '../../consts/routes';
import { Link, Navigate, useNavigate } from 'react-router-dom';

const SignUp: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const navigate = useNavigate();

  const handleSubmit =  async (event: React.FormEvent) => {
    event.preventDefault();
    if (username === '' || email === '' || password === '') {
      setError('All fields are required');
      return;
    }
    
    try{
      const result = await authService.register(username, email, password)
      if(!result){
        throw new Error("INCORRECT_PASSWORD") // Убрать!
      }
      setError('')
      navigate(Paths.SignIn)
    }
    catch (err){
      if (err instanceof Error) {
        setError(err.message || 'An error occurred during registration');
      } else {
        setError('An unknown error occurred');
      }
      console.error(err)
    }

  };


  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={6} style={{ padding: '20px', marginTop: '50px' }}>
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        <form onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Grid>
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
                Sign Up
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" align="center">
                <MuiLink component={Link} to={Paths.SignIn} variant="body2">
                  {"Already have an account? Sign In"}
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

export default SignUp;
