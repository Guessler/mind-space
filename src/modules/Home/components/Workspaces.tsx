import { Box, Card, Typography } from "@mui/material"
import "./Workspaces.css"
import { useState } from "react"
import useSWR from "swr"
import { workspaceService } from "../../../services/workspace.service"

export const Workspaces = () => {
    const [isPopupVisible, setIsPopupVisible] = useState(false)
    const { data, isLoading, mutate } = useSWR('my-workspaces', () => workspaceService.myWorkspaces({page: 1, limit: 10}))
    const [name, setName] = useState("")

    const handleOpen = () => { 
        setIsPopupVisible(true)
    }

    const handleClose = () => {
        setIsPopupVisible(false)
    }

    function handlePopupClick(e: React.MouseEvent<HTMLDivElement>){
        e.stopPropagation();       
    }

    const handleCreate = async () => {
        try{
            if (name.trim() === "") {
                return
            }

            const data = await workspaceService.create(name)
            setName("")
            handleClose()

            mutate()

            alert(`ID: ${data.id}`)
        }catch(err){
            console.error(err)
        }
    }

    if(isLoading){
        return null
    }

    return (
        <Box sx={{width: '100%', display: 'flex', flexDirection: 'row', gap: 10, flexWrap: 'wrap'}}>
            {data?.rows.map((item) =>
                <Card sx={{width: '240px', display: 'flex', flexDirection: 'column',flexWrap:"wrap", gap: 5, padding: '12px 10px'}} key={item.id}>
                    <Box sx={{width: '100%', height: '10rem', background: 'grey'}}></Box>
                    <Typography variant="h4">{item.name}</Typography>
                </Card>
            )}
            <Card onClick={handleOpen} sx={{width: '240px', display: 'flex', flexDirection: 'column', gap: 5, padding: '12px 10px'}}>
                <Box sx={{width: '100%', height: '10rem', background: 'grey'}}>
                    <Typography>+</Typography>
                </Box>
                <Typography variant="h4">Создать новое пространство</Typography>
            </Card>
            {isPopupVisible && (
                <Box onClick={handleClose} sx={{width:'100%', height:'100vh', position:'fixed', top:'0', left:'0', background:'rgba(0, 0, 0, 0.5)', display:'flex', alignItems:'center', justifyContent:'center'}} className="popup-bg">
                    <Box onClick={handlePopupClick} sx={{width:'800px', padding:"50px", height:"500px", background:"white", borderRadius:"40px", display:"flex", flexDirection:"column", gap:"60px", textAlign:"start"}} className="popup">
                        <Typography sx={{fontSize:'24px', fontWeight:"700"}}>Введите название Workspace!</Typography>
                        <Box sx={{display:"flex", flexDirection:'column', gap:'20px'}}>
                            <Typography>Введите название workspace:</Typography>
                            <input className="main-input" type="text" value={name} onChange={(e) => setName(e.target.value)} />
                            <Typography>Добавьте друзей:</Typography>
                            <input className="main-input" type="text" />
                        </Box>
                        <button className="main-btn" onClick={handleCreate}>Создать</button>
                    </Box>
                </Box>
            )}
        </Box>
    )
}
