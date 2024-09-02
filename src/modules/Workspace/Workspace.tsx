import { useParams } from "react-router-dom"
import { BaseLayout } from "../../layout/base"
import useSWR from "swr"
import { workspaceService } from "../../services/workspace.service"
import { useEffect } from "react"
import { Typography } from "@mui/material"

export const Workspace = () => {

    const {id} = useParams()

    const {data, isLoading, error} = useSWR(`workspace-${id}`, () => workspaceService.getById(id as string))

    useEffect(() => {
        if(error && !isLoading){
            console.error(error)
        }
    }, [isLoading,error])

    if(isLoading || !id){
        return null
    }

    return (
        <BaseLayout>
            <Typography sx={{ 
                    fontSize: 40, 
                    fontWeight: "900", 
                    fontFamily: 'Unbounded, sans-serif',
                    color:"#394D70"
                }}  variant="h3">{data?.name}</Typography>
        </BaseLayout>
    )
}