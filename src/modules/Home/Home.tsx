import { BaseLayout } from "../../layout/base";
import { Workspaces } from "./components/Workspaces";
import { Typography, Box } from "@mui/material";
import { useLocation } from 'react-router-dom';

export const Home = () => {
    const location = useLocation();
    const { username } = location.state || {}; // Получаем username из состояния

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
                        {username || 'User'} {/* Если username не передан, отображаем 'User' */}
                    </Typography>
                </Box>

                <Workspaces />
            </BaseLayout>
        </>
    );
};