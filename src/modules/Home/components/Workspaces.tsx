import { Box, Button, Card, TextField, Typography } from "@mui/material";
import "./Workspaces.css";
import { useState } from "react";
import useSWR from "swr";
import { workspaceService } from "../../../services/workspace.service";
import { useNavigate } from "react-router-dom";
import { images } from "../../../modules/exports/images"; // Импорт изображений

export const Workspaces = () => {
    const navigate = useNavigate();
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const { data, isLoading, mutate } = useSWR('my-workspaces', () => workspaceService.myWorkspaces({ page: 1, limit: 10 }));
    const [name, setName] = useState("");

    const handleOpen = () => {
        setIsPopupVisible(true);
    };

    const handleClose = () => {
        setIsPopupVisible(false);
    };

    function handlePopupClick(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
    }

    const handleCreate = async () => {
        try {
            if (name.trim() === "") {
                return;
            }

            await workspaceService.create(name);
            setName("");
            handleClose();
            mutate();
        } catch (err) {
            console.error(err);
        }
    };

    if (isLoading) {
        return null;
    }

    return (
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', gap: "60px", flexWrap: 'wrap', marginTop: "76px" }}>
            {data?.rows.map((item) =>
                <Card onClick={() => navigate(`/${item.id}`)} sx={{ width: '240px', minHeight: "250px", display: 'flex', flexDirection: 'column', alignItems: "center", gap: "10px" }} key={item.id}>
                    <Box sx={{ width: '100%', height: '10rem', background: '#526382', opacity: "0.7", display: "flex", alignItems: "center", justifyContent: "center" }}></Box>
                    <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: "16px", width: "120px", color: "#394D70" }} variant="h4">{item.name}</Typography>
                </Card>
            )}
            <Card onClick={handleOpen} sx={{ width: '240px', minHeight: "250px", display: 'flex', flexDirection: 'column', alignItems: "center", gap: "10px" }}>
                <Box sx={{ width: '100%', height: '10rem', background: '#526382', opacity: "0.7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <img src={images["cross"]} alt="cross" /> {/* Используем изображение из объекта images */}
                </Box>
                <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: "16px", width: "120px", color: "#394D70" }} variant="h4">Create a new workspace</Typography>
            </Card>
            {isPopupVisible && (
                <Box onClick={handleClose} sx={{ width: '100%', height: '100vh', position: 'fixed', top: '0', left: '0', background: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="popup-bg">
                    <Box onClick={handlePopupClick} sx={{ width: '800px', height: "500px", background: "white", borderRadius: "30px", display: "flex", flexDirection: "column", alignItems: "center", gap: "55px" }} className="popup">
                        <Box sx={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Box component="img" alt="photo" src={images["Photo"]} /> {/* Используем изображение из объекта images */}
                            <Box sx={{ position: "absolute" }} component="img" alt="plus" src={images["plus"]} /> {/* Используем изображение из объекта images */}
                        </Box>
                        <Box sx={{ width: "400px", display: "flex", flexDirection: "column", gap: "10px" }}>
                            <Typography
                                sx={{
                                    fontFamily: 'Unbounded, sans-serif',
                                    fontSize: '20px',
                                    fontWeight: "600",
                                    lineHeight: 1.1,
                                    mb: '-4px',
                                    color: "#394D70",
                                }}
                            >
                                Введите название вашего
                            </Typography>
                            <Typography
                                sx={{
                                    fontFamily: 'Unbounded, sans-serif',
                                    fontSize: '40px',
                                    fontWeight: "900",
                                    mt: '-4px',
                                    lineHeight: 1.1,
                                    color: "#394D70",
                                }}
                            >
                                WORKSPACE!
                            </Typography>
                            <Box sx={{ display: "flex", flexDirection: 'column', gap: '20px' }}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    value={name}
                                    placeholder="Например: Magic City design"
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </Box>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                onClick={handleCreate}
                                sx={{
                                    fontFamily: 'Unbounded, sans-serif',
                                    fontWeight: "900",
                                    fontSize: "16px",
                                    textTransform: 'none',
                                    backgroundColor: "#394D70",
                                    '&:hover': {
                                        backgroundColor: "#2c3e50",
                                    }
                                }}
                            >
                                Создать
                            </Button>
                        </Box>
                    </Box>
                </Box>
            )}
        </Box>
    );
};