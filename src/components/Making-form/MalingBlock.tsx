import { Box, Typography } from "@mui/material";
import { ReactNode } from "react";

interface MakingBlockProps {
    children?: ReactNode;
}

export const MakingBlock: React.FC<MakingBlockProps> = ({ children }) => {
    return (
        <Box sx={{ width: "360px", padding: "10px", gap: "10px", boxShadow: '0px 0px 60px rgba(0, 0, 0, 0.2)',
         background: "#FFFFF", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <Typography sx={{
                fontFamily: 'Unbounded, sans-serif',
                fontSize: 20,
                fontWeight: "900",
                lineHeight: 1.1,
                mb: '-4px',
                color: "#394D70"
            }}>
                {children}
            </Typography>
            <Typography sx={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 20,
                fontWeight: 500,
                color: "#394D70",
                opacity: 0.5,
                cursor: "pointer"
            }}>
                Add card +
            </Typography>
        </Box>
    );
};
