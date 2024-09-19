import { BaseLayout } from "../../layout/base"
import { Workspaces } from "./components/Workspaces"
import { Typography } from "@mui/material"

export const Home = () => {

    return (
        <BaseLayout>
                <Typography
                    sx={{
                        fontFamily: 'Unbounded, sans-serif',
                        fontSize: 32,
                        lineHeight: 1.1,
                        mb: '-4px',
                        color: "#394D70"
                    }}
                >
                    wellcome,
                </Typography>
                <Typography
                    sx={{
                        fontSize: 40,
                        fontWeight: "900",
                        mt: '-8px',
                        lineHeight: 1.1,
                        fontFamily: 'Unbounded, sans-serif',
                        color: "#394D70"
                    }}
                >
                    Username!
                </Typography>
                <Workspaces />
        </BaseLayout>
    )
}
