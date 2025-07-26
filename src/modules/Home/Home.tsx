import { BaseLayout } from '../../layout/base';
import { Workspaces } from './components/Workspaces';
import { Typography, Box } from '@mui/material';
import { useLocation } from 'react-router-dom';

export const Home = () => {
  const location = useLocation();
  const { email } = location.state || {};

  return (
    <BaseLayout>
      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{
            fontFamily: 'Unbounded, sans-serif',
            fontSize: { xs: '24px', sm: '28px' },
            lineHeight: 1.2,
            color: '#394D70',
          }}
        >
          Welcome,
        </Typography>
        <Typography
          sx={{
            fontFamily: 'Unbounded, sans-serif',
            fontSize: { xs: '32px', sm: '40px' },
            fontWeight: '900',
            lineHeight: 1.2,
            color: '#394D70',
          }}
        >
          {email || 'UserName'}
        </Typography>
      </Box>

      <Workspaces />
    </BaseLayout>
  );
};