import { Box, Card, Typography } from "@mui/material"

export const Workspaces = () => {

    const data = [
        {
            id: 1,
            name: "Workspace #1"
        },
        {
            id: 2,
            name: "Workspace #2"
        },
    ]

    return (
        <Box sx={{width: '100%', display: 'flex', flexDirection: 'row', gap: 10}}>
            {data.map(item =>
                <Card sx={{width: '240px', display: 'flex', flexDirection: 'column', gap: 5, padding: '12px 10px'}} key={item.id}>
                    <Box sx={{width: '100%', height: '10rem', background: 'grey'}}></Box>
                    <Typography variant="h4">{item.name}</Typography>
                </Card>
            )}
            <Card sx={{width: '240px', display: 'flex', flexDirection: 'column', gap: 5, padding: '12px 10px'}}>
                <Box sx={{width: '100%', height: '10rem', background: 'grey'}}>
                    <Typography>+</Typography>
                </Box>
                <Typography variant="h4">Создать новое пространство</Typography>
            </Card>
                
        </Box>
    )
}