import { useParams } from "react-router-dom";
import { BaseLayout } from "../../layout/base";
import useSWR from "swr";
import { workspaceService } from "../../services/workspace.service";
import { useEffect, useRef, useState, useCallback } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import { MakingBlock } from "../../components/Making-form";
import { Popup } from "../../components/Popup";
import { Menu } from "../../components/Menu";
import Sortable from "sortablejs";

// Типы
type Card = { id: number; selectedImage: string | null };
type Task = { id: number; title: string; cards: Card[] };

// Кастомный хук для работы с localStorage
const useLocalStorage = (key: string, initialValue: string | null) => {
  const [value, setValue] = useState(() => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? storedValue : initialValue;
  });

  useEffect(() => {
    if (value !== null) {
      localStorage.setItem(key, value);
    }
  }, [key, value]);

  return [value, setValue] as const;
};

// Кастомный хук для работы с задачами
const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = useCallback((title: string) => {
    if (title.trim()) {
      const newTask: Task = {
        id: Date.now(),
        title: title.trim(),
        cards: [],
      };
      setTasks((prevTasks) => [...prevTasks, newTask]);
    }
  }, []);

  const moveCard = useCallback((taskId: number, card: Card, from: number, to: number) => {
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
  }, []);

  const addCard = useCallback((taskId: number, card: Card) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, cards: [...task.cards, card] } : task
      )
    );
  }, []);

  const updateCard = useCallback((taskId: number, card: Card) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, cards: task.cards.map((c) => (c.id === card.id ? card : c)) } : task
      )
    );
  }, []);

  const deleteTask = useCallback((taskId: number) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  }, []);

  return { tasks, addTask, moveCard, addCard, updateCard, deleteTask };
};

// Компонент для фонового изображения
const HeaderImageBlock = ({ backgroundImage, onAddImage }: { backgroundImage: string | null; onAddImage: () => void }) => {
  return (
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
        onClick={onAddImage}
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
  );
};

// Основной компонент Workspace
export const Workspace = () => {
  const { id } = useParams();
  const { data, isLoading } = useSWR(`workspace-${id}`, () =>
    workspaceService.getById(id as string)
  );

  const [addImage, setAddImage] = useState(false);
  const [backgroundImage, setBackgroundImage] = useLocalStorage('workspaceBackgroundImage', null);
  const { tasks, addTask, moveCard, addCard, updateCard, deleteTask } = useTasks();
  const [newWorkspaceTitle, setNewWorkspaceTitle] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);

  // Инициализация Sortable
  useEffect(() => {
    if (containerRef.current) {
      const sortable = new Sortable(containerRef.current, {
        animation: 150,
        onStart: () => {
          document.body.style.cursor = "grabbing";
        },
        onEnd: (event) => {
          document.body.style.cursor = "auto";
          const { oldIndex, newIndex } = event;
          if (oldIndex !== undefined && newIndex !== undefined) {
            const newTasks = [...tasks];
            const [movedTask] = newTasks.splice(oldIndex, 1);
            newTasks.splice(newIndex, 0, movedTask);
            // Обновляем задачи (в реальном проекте нужно синхронизировать с сервером)
          }
        },
      });

      return () => sortable.destroy();
    }
  }, [tasks]);

  if (isLoading || !id) {
    return null;
  }

  const handleSelectImage = (imageUrl: string) => {
    setBackgroundImage(imageUrl);
    setAddImage(false);
  };

  const handleAddWorkspace = () => {
    addTask(newWorkspaceTitle);
    setNewWorkspaceTitle("");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleAddWorkspace();
    }
  };

  return (
    <>
      <Menu />
      {addImage && <Popup onClose={() => setAddImage(false)} onSelectImage={handleSelectImage} />}

      <HeaderImageBlock backgroundImage={backgroundImage} onAddImage={() => setAddImage(true)} />

      <BaseLayout>
        <Typography variant="h3" sx={{ fontSize: 40, fontWeight: 900, fontFamily: "Unbounded, sans-serif", color: "#394D70", marginBottom: "50px", marginTop: "20px" }}>
          {data?.name}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
          <TextField
            value={newWorkspaceTitle}
            onChange={(e) => setNewWorkspaceTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Введите название нового workspace"
            sx={{
              width: "100%",
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                "& fieldset": { borderColor: "#394D70" },
                "&:hover fieldset": { borderColor: "#394D70" },
                "&.Mui-focused fieldset": { borderColor: "#394D70" },
              },
              "& .MuiInputBase-input": { color: "#394D70", fontWeight: 600 },
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
              "&:hover": { backgroundColor: "#2C3E50" },
            }}
          >
            Добавить
          </Button>
        </Box>

        {tasks.length > 0 && (
          <Box ref={containerRef} sx={{ display: "flex", flexWrap: "wrap", gap: "150px" }}>
            {tasks.map((task) => (
              <Box key={task.id} sx={{ height: "auto" }}>
                <MakingBlock
                  groupName="shared-group"
                  cards={task.cards}
                  onCardMove={(card, from, to) => moveCard(task.id, card, from, to)}
                  onCardAdd={(card) => addCard(task.id, card)}
                  onCardUpdate={(card) => updateCard(task.id, card)}
                  onDeleteBlock={() => deleteTask(task.id)}
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