import { Box } from "@mui/material";
import { FC, PropsWithChildren } from "react";

export const BaseLayout: FC<PropsWithChildren> = ({ children }) => (
    <Box sx={{ width: '100%', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Box
            sx={{
                width: '100%',
                maxWidth: 1440,
                margin: 'auto',
                padding: { xs: 2, sm: 3, md: 4 },
                flexGrow: 1,
            }}
        >
            {children}
        </Box>
    </Box>
);