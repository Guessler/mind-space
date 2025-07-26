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
      navigate(Paths.SignIn);
    } catch (err) {
      if (!err || !(err as AxiosError) || !(err as AxiosError)?.response) {
        setError('Что-то пошло не так...');
      } else {
        const { message } = ((err as AxiosError).response as AxiosResponse).data as ErrorMessageDto;
        if (message === 'INCORRECT_PASSWORD') {
          setError('Неверный пароль');
        } else if (message === 'INCORRECT_EMAIL') {
          setError('Неверный email');
        } else if (message === 'USER_WITH_THIS_EMAIL_IS_EXISTS') {
          setError('Пользователь с данным email уже существует');
        } else {
          setError('Что-то пошло не так...');
        }
      }
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        backgroundImage: `url(${images['logwallpaper']})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Контейнер с адаптивными отступами */}
      <Container
        component="main"
        maxWidth={false}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          padding: { xs: '0 16px', md: 0 },
          maxWidth: '1200px',
        }}
      >
        <Paper
          elevation={6}
          sx={{
            width: {
              xs: '90vw',
              sm: '400px',
              md: '435px',
            },
            maxWidth: '435px',
            height: {
              xs: 'auto',
              md: '600px',
            },
            borderRadius: '30px',
            textAlign: 'start',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: {
              xs: '24px',
              md: '45px 30px',
            },
            gap: '20px',
          }}
        >
          <Box sx={{ gap: '35px', display: 'flex', flexDirection: 'column' }}>
            <Typography
              component="h1"
              variant="h5"
              sx={{
                fontFamily: 'Unbounded, sans-serif',
                fontWeight: '900',
                fontSize: {
                  xs: '32px',
                  md: '40px',
                },
                color: '#394D70',
              }}
            >
              Sign Up
            </Typography>

            <form onSubmit={handleSubmit} noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography sx={{ color: '#394D70' }}>Enter your username</Typography>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    size="medium"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography sx={{ color: '#394D70' }}>Enter your e-mail</Typography>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    size="medium"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography sx={{ color: '#394D70' }}>Enter your password</Typography>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    size="medium"
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
                      fontWeight: '900',
                      fontSize: '16px',
                      textTransform: 'none',
                      backgroundColor: '#394D70',
                      '&:hover': {
                        backgroundColor: '#2c3e50',
                      },
                    }}
                  >
                    enter
                  </Button>
                </Grid>

                <Grid item xs={12}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#394D70',
                      textAlign: { xs: 'center', sm: 'start' },
                    }}
                  >
                    Already have an account?{' '}
                    <MuiLink
                      component={Link}
                      to={Paths.SignIn}
                      variant="body2"
                      sx={{ color: '#394D70', fontWeight: '600' }}
                    >
                      Sign In
                    </MuiLink>
                  </Typography>
                </Grid>
              </Grid>
            </form>
          </Box>

          <Typography
            sx={{
              color: '#394D70',
              opacity: 0.5,
              fontSize: '12px',
              textAlign: 'center',
            }}
          >
            I have read the{' '}
            <Typography component="span" sx={{ fontWeight: '600' }}>
              privacy policy
            </Typography>{' '}
            for the collection of data relating to the sending of the request
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default SignUp;