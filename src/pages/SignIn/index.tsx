import React, { useContext, useState } from 'react';
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
import { authService } from '../../services/auth';
import { AxiosError, AxiosResponse } from 'axios';
import { ErrorMessageDto } from '../../types/error';
import { Paths } from '../../consts/routes';
import {observer} from 'mobx-react-lite'
import { context } from '../..';

const SignIn: React.FC = observer(() => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const ctx = useContext(context)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (email === '' || password === '') {
      setError('All fields are required');
      return;
    }
    setError('');
    
    try{
      const result = await authService.login(email, password)
      if(!result){
        throw new Error("SOMETHING_WENT_WRONG")
      }

      localStorage.setItem('token', result)
      ctx?.authStore?.setIsAuth(true)
      navigate(Paths.Home)
    }catch(err){
      if(!err || !(err as AxiosError) || !(err as AxiosError)?.response){
        setError('Что-то пошло не так...');
      }
      const {message} = ((err as AxiosError).response as AxiosResponse).data as ErrorMessageDto
      if(message === "INCORRECT_PASSWORD"){
        setError('Неверный пароль');
      }
      if(message === "USER_WITH_THIS_EMAIL_NOT_FOUND"){
        setError('Пользователь с данной почтой не найден в системе');
      }
    }
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
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                label="Password"
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
                color="primary"
              >
                Sign In
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" align="center">
                <MuiLink component={Link} to={Paths.SignUp} variant="body2">
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
})

export default SignIn;
