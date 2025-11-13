import { Box, Button, Card, FormControl, FormControlLabel, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import { useState } from "react";
import useSWR from "swr";
import { workspaceService } from "../../../services/workspace.service";
import { useNavigate } from "react-router-dom";
import { images } from "../../../modules/exports/images";
import { Popup } from "../../../components/Popup";
import { WorkspaceType } from "../../../types/workspace";

export const Workspaces = () => {
    const navigate = useNavigate();
    const [isMainModalVisible, setIsMainModalVisible] = useState(false);
    const [isImagePopupVisible, setIsImagePopupVisible] = useState(false);
    const [name, setName] = useState("");
    const [workspaceType, setWorkspaceType] = useState<WorkspaceType>(WorkspaceType.KANBAN_BOARD)
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
            await workspaceService.create(workspaceType, name);
            setName("");
            setWorkspaceType(WorkspaceType.KANBAN_BOARD);
            setSelectedImage(null);
            handleCloseMainModal();
            mutate();
            console.log(workspaceType)
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
        return null;
    }

    return (
        <Box
            sx={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                gap: "60px",
                marginTop: "76px",
                justifyContent: {
                    xs: "center",
                    sm: "flex-start",
                },
            }}
        >
            {(data?.rows || []).map((item) => {
                const backgroundImage = getBackgroundImageForWorkspace(item.id);
                return (
                    <Card
                        onClick={() => navigate(`/${item.id}`)}
                        sx={{
                            width: {
                                xs: "90vw",
                                sm: "220px",
                                md: "240px",
                            },
                            maxWidth: {
                                xs: "300px",
                                sm: "220px",
                                md: "240px",
                            },
                            minHeight: {
                                xs: "200px",
                                sm: "250px",
                            },
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
                                height: {
                                    xs: "8rem",
                                    sm: "10rem",
                                },
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
                                fontSize: {
                                    xs: "14px",
                                    sm: "16px",
                                },
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

            <Card
                onClick={handleOpenMainModal}
                sx={{
                    width: {
                        xs: "90vw",
                        sm: "220px",
                        md: "240px",
                    },
                    maxWidth: {
                        xs: "300px",
                        sm: "220px",
                        md: "240px",
                    },
                    minHeight: {
                        xs: "200px",
                        sm: "250px",
                    },
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "10px",
                }}
            >
                <Box
                    sx={{
                        width: "100%",
                        height: {
                            xs: "8rem",
                            sm: "10rem",
                        },
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
                        fontSize: {
                            xs: "14px",
                            sm: "16px",
                        },
                        width: "100%",
                        textAlign: "center",
                        color: "#394D70",
                    }}
                    variant="h4"
                >
                    create new workspace
                </Typography>
            </Card>

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
                        zIndex: 1,
                    }}
                    className="popup-bg"
                >
                    <Box
                        onClick={handlePopupClick}
                        sx={{
                            width: {
                                xs: "90vw",
                                sm: "80vw",
                                md: "1000px",
                            },
                            height: {
                                xs: "auto",
                                md: "800px",
                            },
                            maxHeight: {
                                xs: "90vh",
                            },
                            overflowY: {
                                xs: "auto",
                                md: "visible",
                            },
                            background: "white",
                            borderRadius: {
                                xs: "20px",
                                md: "30px",
                            },
                            display: "flex",
                            flexDirection: {
                                xs: "column",
                                md: "column",
                            },
                            alignItems: "center",
                            gap: {
                                xs: "30px",
                                md: "55px",
                            },
                            padding: {
                                xs: "20px 0",
                                md: "0",
                            },
                            maxWidth: "100vw",
                        }}
                        className="popup"
                    >
                        {/* Изображение */}
                        <Box sx={{ position: "relative", width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Box
                                sx={{
                                    width: "100%",
                                    height: {
                                        xs: "250px",
                                        sm: "300px",
                                        md: "400px",
                                    },
                                    borderTopLeftRadius: {
                                        xs: "20px",
                                        md: "10px",
                                    },
                                    borderTopRightRadius: {
                                        xs: "20px",
                                        md: "10px",
                                    },
                                    objectFit: "cover",
                                    objectPosition: "center",
                                }}
                                component="img"
                                alt="photo"
                                src={selectedImage || images["black"]}
                            />
                            <Box
                                sx={{
                                    position: "absolute",
                                    width: "40px",
                                    height: "40px",
                                    cursor: "pointer",
                                    transition: "transform 0.2s",
                                    "&:hover": {
                                        transform: "scale(1.1)",
                                    },
                                    "@media (hover: none)": {
                                        width: "50px",
                                        height: "50px",
                                    },
                                }}
                                component="img"
                                alt="plus"
                                src={images["plus"]}
                                onClick={handleOpenImagePopup}
                            />
                        </Box>

                        <Box
                            sx={{
                                width: {
                                    xs: "90%",
                                    sm: "80%",
                                },
                                display: "flex",
                                flexDirection: "column",
                                gap: "20px",
                                px: {
                                    xs: "16px",
                                    sm: "0",
                                },
                            }}
                        >
                            <Typography
                                sx={{
                                    fontFamily: "Unbounded, sans-serif",
                                    fontSize: {
                                        xs: "18px",
                                        sm: "20px",
                                    },
                                    fontWeight: "600",
                                    lineHeight: 0,
                                    mb: "-4px",
                                    color: "#394D70",
                                    textAlign: "center",
                                }}
                            >
                                Введите название вашего
                            </Typography>
                            <Typography
                                sx={{
                                    fontFamily: "Unbounded, sans-serif",
                                    fontSize: {
                                        xs: "32px",
                                        sm: "40px",
                                    },
                                    fontWeight: "900",
                                    mt: "-4px",
                                    lineHeight: 1.1,
                                    color: "#394D70",
                                    textAlign: "center",
                                }}
                            >
                                WORKSPACE!
                            </Typography>

                            <FormControl>
                                <RadioGroup
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    defaultValue="female"
                                    name="radio-buttons-group"
                                    sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}
                                    value = {workspaceType}
                                    onChange={(e)=>setWorkspaceType(e.target.value as WorkspaceType)}
                                >
                                    <FormControlLabel value={WorkspaceType.KANBAN_BOARD} control={<Radio />}  label="Kanban Board" />
                                    <FormControlLabel value={WorkspaceType.TODO_LIST} control={<Radio />} label="Todo List" />
                                    <FormControlLabel value={WorkspaceType.DROW_BOARD} control={<Radio />} label="Drow Board" />
                                </RadioGroup>
                            </FormControl>

                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                value={name}
                                placeholder="Например: Magic City design"
                                onChange={(e) => setName(e.target.value)}
                                sx={{
                                    "& .MuiInputBase-input": {
                                        fontSize: {
                                            xs: "14px",
                                            sm: "16px",
                                        },
                                    },
                                }}
                            />

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
                                    py: "10px",
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