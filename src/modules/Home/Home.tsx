import { Typography } from "@mui/material"
import { BaseLayout } from "../../layout/base"
import { Workspaces } from "./components/Workspaces"

export const Home = () => {

    return (
        <BaseLayout>
            <Typography variant="h2">Wellcome, username!</Typography>
            <Workspaces />
        </BaseLayout>   
    )
}