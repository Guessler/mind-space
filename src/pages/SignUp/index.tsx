import React, { useState } from 'react';
import {
  Button,
  TextField,
  Grid,
  Paper,
  Typography,
  Container,
  Link as MuiLink,
  Box,
} from '@mui/material';
import { authService } from '../../services/auth';
import { AxiosError, AxiosResponse } from 'axios';
import { ErrorMessageDto } from '../../types/error';
import { Paths } from '../../consts/routes';
import { Link, useNavigate } from 'react-router-dom';
import { images } from '../../modules/exports/images';

const SignUp: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (username === '' || email === '' || password === '') {
        setError('All fields are required');
        return;
    }

    try {
        await authService.register(username, email, password);
        setError('');
        navigate(Paths.Home, { state: { username } }); // Передаем username на маршрут Home
    } catch (err) {
        if (!err || !(err as AxiosError) || !(err as AxiosError)?.response) {
            setError('Что-то пошло не так...');
        } else {
            const { message } = ((err as AxiosError).response as AxiosResponse).data as ErrorMessageDto;
            if (message === 'INCORRECT_PASSWORD') {
                setError('Неверный пароль');
            }
            if (message === 'INCORRECT_EMAIL') {
                setError('Неверный email');
            }
            if (message === 'USER_WITH_THIS_EMAIL_IS_EXISTS') {
                setError('User с данным email уже есть');
            }
        }
    }
};
  return (
    <Box sx={{
      width: "100%",
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundImage: `url(${images["logwallpaper"]})`,
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover"
    }}>
      <Container component="main" maxWidth="xs" style={{
        maxWidth: "1200px",
        width: "100%",
      }}>
        <Paper elevation={6} style={{
          width: "435px",
          height: "600px",
          borderRadius: "30px",
          textAlign: "start",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "45px 30px",
        }}>
          <Box sx={{ gap: "35px", display: "flex", flexDirection: "column" }}>
            <Typography component="h1" variant="h5" sx={{
              fontFamily: 'Unbounded, sans-serif',
              fontWeight: "900",
              fontSize: "40px",
              color: "#394D70",
            }}>
              Sign Up
            </Typography>
            <form onSubmit={handleSubmit} noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography sx={{ color: "#394D70", }}>Enter your username</Typography>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography sx={{ color: "#394D70", }}>Enter your e-mail</Typography>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography sx={{ color: "#394D70", }}>Enter your password</Typography>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    type="password"
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
                    sx={{
                      fontFamily: 'Unbounded, sans-serif',
                      fontWeight: "900",
                      fontSize: "16px",
                      textTransform: 'none',
                      backgroundColor: "#394D70",
                      '&:hover': {
                        backgroundColor: "#2c3e50",
                      }
                    }}
                  >
                    enter
                  </Button>
                </Grid>
                <Grid item xs={12} sx={{ textAlign: "start" }}>
                  <Typography variant="body2" sx={{ color: "#394D70", textAlign: "start" }}>
                    Already have an account?{' '}
                    <MuiLink component={Link} to={Paths.SignIn} variant="body2" sx={{ color: "#394D70", fontWeight: "600" }}>
                      Sign In
                    </MuiLink>
                  </Typography>
                </Grid>
              </Grid>
            </form>
          </Box>
          <Typography sx={{ color: "#394D70", opacity: 0.5 }}>
            I have read the <Typography component="span" sx={{ fontWeight: "600" }}>privacy policy</Typography> for the collection of data relating to the sending of the request
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default SignUp;