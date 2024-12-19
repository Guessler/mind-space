import { useParams } from "react-router-dom";
import { BaseLayout } from "../../layout/base";
import useSWR from "swr";
import { workspaceService } from "../../services/workspace.service";
import { useEffect, useRef, useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import { MakingBlock } from "../../components/Making-form";
import { Popup } from "../../components/Popup";
import { Menu } from "../../components/Menu";
import Sortable from "sortablejs"; // Импортируем Sortable

export const Workspace = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useSWR(`workspace-${id}`, () =>
    workspaceService.getById(id as string)
  );

  const [addImage, setAddImage] = useState<boolean>(false);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [tasks, setTasks] = useState<{ id: number; title: string; cards: { id: number; selectedImage: string | null }[] }[]>([]);
  const [newWorkspaceTitle, setNewWorkspaceTitle] = useState<string>("");

  const containerRef = useRef<HTMLDivElement>(null); // Ссылка на контейнер с блоками
  const sortableInstance = useRef<Sortable | null>(null); // Экземпляр Sortable

  useEffect(() => {
    if (error && !isLoading) {
      console.error(error);
    }
  }, [isLoading, error]);

  useEffect(() => {
    if (containerRef.current) {
      sortableInstance.current = new Sortable(containerRef.current, {
        animation: 150,
        onStart: () => {
          // Изменяем курсор на "grabbing" при начале перетаскивания
          document.body.style.cursor = "grabbing";
        },
        onEnd: (event) => {
          // Возвращаем курсор в исходное состояние после завершения перетаскивания
          document.body.style.cursor = "auto";

          const { oldIndex, newIndex } = event;
          if (oldIndex !== undefined && newIndex !== undefined) {
            const newTasks = [...tasks];
            const [movedTask] = newTasks.splice(oldIndex, 1);
            newTasks.splice(newIndex, 0, movedTask);
            setTasks(newTasks); // Обновляем состояние с новым порядком блоков
          }
        },
      });
    }

    return () => {
      if (sortableInstance.current) {
        sortableInstance.current.destroy(); // Удаляем Sortable при размонтировании
        sortableInstance.current = null;
      }
    };
  }, [tasks]);

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
        cards: [],
      };
      setTasks((prevTasks) => [...prevTasks, newWorkspace]);
      setNewWorkspaceTitle("");
    }
  };

  const handleCardMove = (taskId: number, card: { id: number; selectedImage: string | null }, from: number, to: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              cards: task.cards.map((c, index) => (index === from ? { ...c, id: card.id } : c)),
            }
          : task
      )
    );
  };

  const handleCardAdd = (taskId: number, card: { id: number; selectedImage: string | null }) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, cards: [...task.cards, card] } : task
      )
    );
  };

  const handleCardUpdate = (taskId: number, card: { id: number; selectedImage: string | null }) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, cards: task.cards.map((c) => (c.id === card.id ? card : c)) } : task
      )
    );
  };

  const handleDeleteBlock = (taskId: number) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
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
          transition: "0.2s all",
          backgroundSize: "cover",
          borderRadius: "0 0 20px 20px",
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
          <Box
            ref={containerRef} // Добавляем ссылку на контейнер
            sx={{ display: "flex", flexWrap: "wrap", gap: "150px" }}
          >
            {tasks.map((task) => (
              <Box key={task.id} sx={{ height: "auto" }}>
                <MakingBlock
                  groupName="shared-group"
                  cards={task.cards}
                  onCardMove={(card, from, to) => handleCardMove(task.id, card, from, to)}
                  onCardAdd={(card) => handleCardAdd(task.id, card)}
                  onCardUpdate={(card) => handleCardUpdate(task.id, card)}
                  onDeleteBlock={() => handleDeleteBlock(task.id)} // Передаем обработчик удаления
                >
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