import { BaseLayout } from "../../layout/base";
import { Workspaces } from "./components/Workspaces";
import { Typography, Box } from "@mui/material";
import { useLocation } from 'react-router-dom';

export const Home = () => {
  const location = useLocation();
  const { email } = location.state || {}; // Получаем email из состояния маршрутизации

  return (
    <>
      <BaseLayout>
        <Box sx={{ mb: 4 }}>
          <Typography
            sx={{
              fontFamily: 'Unbounded, sans-serif',
              fontSize: 32,
              lineHeight: 1.1,
              color: "#394D70",
            }}
          >
            Welcome,
          </Typography>
          <Typography
            sx={{
              fontSize: 40,
              fontWeight: "900",
              lineHeight: 1.1,
              fontFamily: 'Unbounded, sans-serif',
              color: "#394D70",
            }}
          >
            {email || 'User'} {/* Отображаем email или "User", если email отсутствует */}
          </Typography>
        </Box>

        <Workspaces />
      </BaseLayout>
    </>
  );
};