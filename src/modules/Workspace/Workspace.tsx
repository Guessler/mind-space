import { useParams } from "react-router-dom";
import { BaseLayout } from "../../layout/base";
import useSWR from "swr";
import { workspaceService } from "../../services/workspace.service";
import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { MakingBlock } from "../../components/Making-form";
import { Popup } from "../../components/Popup";

export const Workspace = () => {
    const { id } = useParams();
    const { data, isLoading, error } = useSWR(`workspace-${id}`, () => workspaceService.getById(id as string));
    
    const [addImage, setAddImage] = useState<boolean>(false);
    const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

    useEffect(() => {
        if (error && !isLoading) {
            console.error(error);
        }
    }, [isLoading, error]);

    if (isLoading || !id) {
        return null;
    }

    const tasks = [
        { id: 1, title: "to do" },
        { id: 2, title: "doing" },
        { id: 3, title: "done" },
    ];

    const handleClosePopup = () => {
        setAddImage(false);
    };

    const handleSelectImage = (imageUrl: string) => {
        setBackgroundImage(imageUrl);
        setAddImage(false);
    };

    return (
        <>
            {addImage && 
                <Popup
                    onClose={handleClosePopup}
                    onSelectImage={handleSelectImage}
                />
            }

            <Box 
                sx={{
                    width: "100%", 
                    minHeight: "50px", 
                    height: backgroundImage ? "300px" : "50px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    "&:hover .add-image-text": {
                        opacity: 0.8
                    }
                }} 
            >
                <Typography 
                    className="add-image-text" 
                    onClick={() => { setAddImage(true); }} 
                    sx={{
                        fontFamily: "Unbounded",
                        color: "#394D70",
                        fontWeight: 900,
                        opacity: 0.1,
                        cursor: "pointer",
                        transition: "opacity 0.5s ease",
                    }}
                >
                    Добавить изображение
                </Typography>
            </Box>

            <BaseLayout>
                <Typography sx={{
                    fontSize: 40,
                    fontWeight: "900",
                    fontFamily: 'Unbounded, sans-serif',
                    color: "#394D70",
                    marginBottom: "50px",
                    marginTop: "20px",
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
    );
};