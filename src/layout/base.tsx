import { Box } from "@mui/material";
import { FC, PropsWithChildren } from "react";

export const BaseLayout: FC<PropsWithChildren> = ({children}) => (
    <Box>
        <Box sx={{width: 1440, margin: 'auto'}}>{children}</Box>
    </Box>
)