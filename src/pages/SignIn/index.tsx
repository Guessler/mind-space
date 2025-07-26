import React, { useContext, useState } from 'react';
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
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth';
import { AxiosError, AxiosResponse } from 'axios';
import { ErrorMessageDto } from '../../types/error';
import { Paths } from '../../consts/routes';
import { observer } from 'mobx-react-lite';
import { context } from '../..';
import { images } from '../../modules/exports/images';

const SignIn: React.FC = observer(() => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const ctx = useContext(context);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (email === '' || password === '') {
      setError('All fields are required');
      return;
    }
    setError('');

    try {
      const result = await authService.login(email, password);
      if (!result) {
        throw new Error("SOMETHING_WENT_WRONG");
      }

      localStorage.setItem('token', result);
      ctx?.authStore?.setIsAuth(true);

      navigate(Paths.Home, { state: { email } });
    } catch (err) {
      if (!err || !(err as AxiosError) || !(err as AxiosError)?.response) {
        setError('Что-то пошло не так...');
        return;
      }
      const { message } = ((err as AxiosError).response as AxiosResponse).data as ErrorMessageDto;
      if (message === "INCORRECT_PASSWORD") {
        setError('Неверный пароль');
      } else if (message === "USER_WITH_THIS_EMAIL_NOT_FOUND") {
        setError('Пользователь с данной почтой не найден в системе');
      } else {
        setError('Что-то пошло не так...');
      }
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        backgroundImage: `url(${images['darklogwallpaper']})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Контейнер без фиксированной ширины, но с отступами на мобильных */}
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
              xs: '90vw',    // 90% ширины экрана на мобильных
              sm: '400px',   // Уменьшенная ширина на малых экранах
              md: '435px',   // Оригинальная ширина на десктопе
            },
            maxWidth: '435px',
            height: {
              xs: 'auto',    // Автовысота на мобильных
              md: '600px',   // Фиксированная высота на десктопе
            },
            borderRadius: '30px',
            textAlign: 'start',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: {
              xs: '24px',    // Меньше паддингов на мобильных
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
                  xs: '32px', // Меньше на мобильных
                  md: '40px', // Оригинальный размер
                },
                color: '#394D70',
              }}
            >
              Sign In
            </Typography>

            <form onSubmit={handleSubmit} noValidate>
              <Grid container spacing={2}>
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

                <Grid
                  item
                  xs={12}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: { xs: '16px', sm: '8px' },
                  }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      width: {
                        xs: '100%',
                        sm: '200px',
                      },
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

                  <Typography
                    sx={{
                      color: '#394D70',
                      textDecoration: 'underline',
                      textDecorationColor: '#394D70',
                      textDecorationStyle: 'solid',
                      fontSize: '14px',
                    }}
                  >
                    Forgot password
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#394D70',
                      textAlign: { xs: 'center', sm: 'start' },
                    }}
                  >
                    Don't have an account?{' '}
                    <MuiLink
                      component={Link}
                      to={Paths.SignUp}
                      variant="body2"
                      sx={{ color: '#394D70', fontWeight: '600' }}
                    >
                      Sign-up
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
});

export default SignIn;