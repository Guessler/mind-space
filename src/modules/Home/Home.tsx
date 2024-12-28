import { BaseLayout } from "../../layout/base";
import { Workspaces } from "./components/Workspaces";
import { Typography, Box } from "@mui/material";

export const Home = () => {
    return (
        <>
            <BaseLayout>
                {/* Группировка текста с помощью Box */}
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
                        Username
                    </Typography>
                </Box>

                {/* Компонент Workspaces */}
                <Workspaces />
            </BaseLayout>
        </>
    );
};