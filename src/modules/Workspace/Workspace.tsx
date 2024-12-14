import { useParams } from "react-router-dom";
import { BaseLayout } from "../../layout/base";
import useSWR from "swr";
import { workspaceService } from "../../services/workspace.service";
import { useEffect, useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import { MakingBlock } from "../../components/Making-form";
import { Popup } from "../../components/Popup";
import { Menu } from "../../components/Menu";

export const Workspace = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useSWR(`workspace-${id}`, () =>
    workspaceService.getById(id as string)
  );

  const [addImage, setAddImage] = useState<boolean>(false);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [tasks, setTasks] = useState<{ id: number; title: string }[]>([]);
  const [newWorkspaceTitle, setNewWorkspaceTitle] = useState<string>("");

  useEffect(() => {
    if (error && !isLoading) {
      console.error(error);
    }
  }, [isLoading, error]);

  if (isLoading || !id) {
    return null;
  }

  const handleClosePopup = () => {
    setAddImage(false);
  };

  const handleSelectImage = (imageUrl: string) => {
    setBackgroundImage(imageUrl);
    setAddImage(false);
  };

  const handleAddWorkspace = () => {
    if (newWorkspaceTitle.trim()) {
      const newWorkspace = {
        id: Date.now(),
        title: newWorkspaceTitle.trim(),
      };
      setTasks((prevTasks) => [...prevTasks, newWorkspace]);
      setNewWorkspaceTitle("");
    }
  };

  const handleCardMove = (card: { id: number; selectedImage: string | null }, from: number, to: number) => {
    if (card) {
      console.log("Card moved:", card, "from:", from, "to:", to);
    } else {
      console.error("Card is undefined");
    }
  };

  return (
    <>
      <Menu />
      {addImage && (
        <Popup onClose={handleClosePopup} onSelectImage={handleSelectImage} />
      )}

      <Box
        sx={{
          width: "100%",
          minHeight: "50px",
          height: backgroundImage ? "300px" : "50px",
          marginTop: backgroundImage ? "" : "50px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          "&:hover .add-image-text": {
            opacity: 0.8,
          },
        }}
      >
        <Typography
          className="add-image-text"
          onClick={() => {
            setAddImage(true);
          }}
          sx={{
            fontFamily: "Unbounded",
            color: backgroundImage ? "#FFFFFF" : "#394D70",
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
        <Typography
          sx={{
            fontSize: 40,
            fontWeight: "900",
            fontFamily: "Unbounded, sans-serif",
            color: "#394D70",
            marginBottom: "50px",
            marginTop: "20px",
          }}
          variant="h3"
        >
          {data?.name}
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          <TextField
            value={newWorkspaceTitle}
            onChange={(e) => setNewWorkspaceTitle(e.target.value)}
            placeholder="Введите название нового workspace"
            sx={{
              width: "100%",
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                "& fieldset": {
                  borderColor: "#394D70",
                },
                "&:hover fieldset": {
                  borderColor: "#394D70",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#394D70",
                },
              },
              "& .MuiInputBase-input": {
                color: "#394D70",
                fontWeight: 600,
              },
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddWorkspace}
            sx={{
              backgroundColor: "#394D70",
              color: "#FFFFFF",
              fontWeight: 600,
              borderRadius: "10px",
              padding: "10px 20px",
              "&:hover": {
                backgroundColor: "#2C3E50",
              },
            }}
          >
            Добавить
          </Button>
        </Box>

        {tasks.length > 0 && (
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            {tasks.map((task) => (
              <Box key={task.id} sx={{ height: "auto" }}>
                <MakingBlock groupName="shared-group" onCardMove={handleCardMove}>
                  {task.title}
                </MakingBlock>
              </Box>
            ))}
          </Box>
        )}
      </BaseLayout>
    </>
  );
};