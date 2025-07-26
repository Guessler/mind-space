import { Box, Button, Card, TextField, Typography } from "@mui/material";
import { useState } from "react";
import useSWR from "swr";
import { workspaceService } from "../../../services/workspace.service";
import { useNavigate } from "react-router-dom";
import { images } from "../../../modules/exports/images";
import { Popup } from "../../../components/Popup";

export const Workspaces = () => {
    const navigate = useNavigate();
    const [isMainModalVisible, setIsMainModalVisible] = useState(false);
    const [isImagePopupVisible, setIsImagePopupVisible] = useState(false);
    const [name, setName] = useState("");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const { data, isLoading, mutate } = useSWR("my-workspaces", () =>
        workspaceService.myWorkspaces({ page: 1, limit: 100 })
    );

    const handleOpenMainModal = () => {
        setIsMainModalVisible(true);
    };

    const handleCloseMainModal = () => {
        setIsMainModalVisible(false);
    };

    const handleOpenImagePopup = () => {
        setIsImagePopupVisible(true);
    };

    const handleCloseImagePopup = () => {
        setIsImagePopupVisible(false);
    };

    const handlePopupClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
    };

    const handleCreate = async () => {
        try {
            if (name.trim() === "") return;
            await workspaceService.create(name);
            setName("");
            setSelectedImage(null);
            handleCloseMainModal();
            mutate();
        } catch (err) {
            console.error("Ошибка при создании workspace:", err);
        }
    };

    const handleSelectImage = (url: string) => {
        setSelectedImage(url);
    };

    const getBackgroundImageForWorkspace = (workspaceId: number | string): string | null => {
        const key = `workspaceBackgroundImage-${workspaceId}`;
        const saved = localStorage.getItem(key);
        return saved ? saved : null;
    };

    if (isLoading) {
        return null; // можно оставить, если хочешь полный "пустой" экран при загрузке
    }

    return (
        <Box
            sx={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                gap: "60px",
                flexWrap: "wrap",
                marginTop: "76px",
            }}
        >
            {/* ✅ Исправлено: теперь безопасно, даже если data или data.rows — undefined */}
            {(data?.rows || []).map((item) => {
                const backgroundImage = getBackgroundImageForWorkspace(item.id);
                return (
                    <Card
                        onClick={() => navigate(`/${item.id}`)}
                        sx={{
                            width: "240px",
                            minHeight: "250px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "10px",
                        }}
                        key={item.id}
                    >
                        <Box
                            sx={{
                                width: "100%",
                                height: "10rem",
                                backgroundImage: backgroundImage ? `url(${backgroundImage})` : "#526382",
                                backgroundSize: "cover",
                                opacity: "0.8",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        ></Box>
                        <Typography
                            sx={{
                                fontFamily: "Inter, sans-serif",
                                fontSize: "16px",
                                width: "100%",
                                color: "#394D70",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}
                            variant="h4"
                        >
                            {item.name.length > 20 ? `${item.name.slice(0, 20)}...` : item.name}
                        </Typography>
                    </Card>
                );
            })}

            {/* Кнопка создания — оставлена как есть */}
            <Card
                onClick={handleOpenMainModal}
                sx={{
                    width: "240px",
                    minHeight: "250px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "10px",
                }}
            >
                <Box
                    sx={{
                        width: "100%",
                        height: "10rem",
                        background: "#526382",
                        opacity: "0.7",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <img src={images["cross"]} alt="cross" />
                </Box>
                <Typography
                    sx={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "16px",
                        width: "120px",
                        color: "#394D70",
                    }}
                    variant="h4"
                >
                    create new workspace
                </Typography>
            </Card>

            {/* Модалка — без изменений */}
            {isMainModalVisible && (
                <Box
                    onClick={handleCloseMainModal}
                    sx={{
                        width: "100%",
                        height: "100vh",
                        position: "fixed",
                        top: 0,
                        left: 0,
                        background: "rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    className="popup-bg"
                >
                    <Box
                        onClick={handlePopupClick}
                        sx={{
                            width: "1000px",
                            height: "700px",
                            background: "white",
                            borderRadius: "30px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "55px",
                        }}
                        className="popup"
                    >
                        <Box sx={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Box
                                sx={{
                                    width: "1000px",
                                    height: "400px",
                                    borderRadius: "10px 10px 0 0",
                                    objectFit: "cover",
                                    objectPosition: "center",
                                }}
                                component="img"
                                alt="photo"
                                src={selectedImage || images["black"]}
                            />
                            <Box
                                sx={{ position: "absolute" }}
                                component="img"
                                alt="plus"
                                src={images["plus"]}
                                onClick={handleOpenImagePopup}
                            />
                        </Box>
                        <Box sx={{ width: "400px", display: "flex", flexDirection: "column", gap: "10px" }}>
                            <Typography
                                sx={{
                                    fontFamily: "Unbounded, sans-serif",
                                    fontSize: "20px",
                                    fontWeight: "600",
                                    lineHeight: 1.1,
                                    mb: "-4px",
                                    color: "#394D70",
                                }}
                            >
                                Введите название вашего
                            </Typography>
                            <Typography
                                sx={{
                                    fontFamily: "Unbounded, sans-serif",
                                    fontSize: "40px",
                                    fontWeight: "900",
                                    mt: "-4px",
                                    lineHeight: 1.1,
                                    color: "#394D70",
                                }}
                            >
                                WORKSPACE!
                            </Typography>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
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
                                    fontFamily: "Unbounded, sans-serif",
                                    fontWeight: "900",
                                    fontSize: "16px",
                                    textTransform: "none",
                                    backgroundColor: "#394D70",
                                    "&:hover": {
                                        backgroundColor: "#2c3e50",
                                    },
                                }}
                            >
                                Создать
                            </Button>
                        </Box>
                    </Box>
                </Box>
            )}

            {/* Всплывающее окно выбора изображения */}
            {isImagePopupVisible && (
                <Popup onClose={handleCloseImagePopup} onSelectImage={handleSelectImage} />
            )}
        </Box>
    );
};