import { useParams } from "react-router-dom"
import { BaseLayout } from "../../layout/base"
import useSWR from "swr"
import { workspaceService } from "../../services/workspace.service"
import { useEffect } from "react"
import { Box,  Typography } from "@mui/material"

import { MakingBlock } from "../../components/Making-form"

import blood  from "../../assets/blood.png"

export const Workspace = () => {

    const { id } = useParams()

    const { data, isLoading, error } = useSWR(`workspace-${id}`, () => workspaceService.getById(id as string))

    useEffect(() => {
        if (error && !isLoading) {
            console.error(error)
        }
    }, [isLoading, error])

    if (isLoading || !id) {
        return null
    }

    const tasks = [
        { id: 1, title: "to do" },
        { id: 2, title: "doing" },
        { id: 3, title: "done" },

    ]

    return (
        <>
            <Box sx={{
                 width: "100%", 
                 height: "350px", 
                 backgroundImage: `url(${blood})`,
                 backgroundSize: 'cover',
            }}></Box>
        <BaseLayout>
                <Typography sx={{
                    fontSize: 40,
                    fontWeight: "900",
                    fontFamily: 'Unbounded, sans-serif',
                    color: "#394D70",
                    marginBottom: "50px",
                    marginTop: "50px",
                }} variant="h3">{data?.name}</Typography>
                <Box sx={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between", }}>
                    {tasks.map((task) => (
                        <MakingBlock key={task.id}>
                            {task.title}
                        </MakingBlock>
                    ))}
                </Box>
        </BaseLayout>
        </>
    )
}