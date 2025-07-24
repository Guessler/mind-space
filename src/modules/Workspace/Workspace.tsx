import React, { useState, useEffect, useCallback } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useParams, useNavigate } from "react-router-dom";
import { BaseLayout } from "../../layout/base";
import useSWR, { useSWRConfig } from "swr";
import { workspaceService } from "../../services/workspace.service";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Popup } from "../../components/Popup";
import { Menu } from "../../components/Menu";
import { Card } from "../../components/CardItem";
import { MakingBlock } from "../../components/Making-form";
import DeleteIcon from "@mui/icons-material/Delete";
import { images } from "../../modules/exports/images"; // Импортируем изображения

type Task = {
  id: string;
  title: string;
  cards: Card[];
};

export const Workspace = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { mutate } = useSWRConfig();
  const { data, isLoading, mutate: mutateWorkspace } = useSWR(
    id ? `workspace-${id}` : null,
    () => (id ? workspaceService.getById(id) : null)
  );

  // --- Управление фоном ---
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

  // При появлении id — читаем фон или устанавливаем временный
  useEffect(() => {
    if (id) {
      const key = `workspaceBackgroundImage-${id}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        setBackgroundImage(JSON.parse(saved));
      } else {
        // 🖤 Устанавливаем временный фон: images["black"]
        const tempBackground = images["black"];
        setBackgroundImage(tempBackground);
        localStorage.setItem(key, JSON.stringify(tempBackground));
      }
    }
  }, [id]);

  // Функция для обновления фона
  const handleSetBackgroundImage = useCallback((url: string | null) => {
    setBackgroundImage(url);
    if (id) {
      localStorage.setItem(`workspaceBackgroundImage-${id}`, JSON.stringify(url));
    }
  }, [id]);

  // --- Управление задачами ---
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (!id) return [];
    const stored = localStorage.getItem(`tasks-${id}`);
    return stored ? JSON.parse(stored) : [];
  });

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  const [isCardImagePopupOpen, setIsCardImagePopupOpen] = useState(false);
  const [currentCardId, setCurrentCardId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [workspaceName, setWorkspaceName] = useState(data?.name || "");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Обновляем имя workspace при получении данных
  useEffect(() => {
    if (data?.name) {
      setWorkspaceName(data.name);
    }
  }, [data?.name]);

  // Сохраняем задачи в localStorage
  useEffect(() => {
    if (id) {
      localStorage.setItem(`tasks-${id}`, JSON.stringify(tasks));
    }
  }, [tasks, id]);

  // --- Функции ---
  const handleRename = async () => {
    if (!id || !workspaceName.trim() || workspaceName === data?.name) {
      setIsEditing(false);
      return;
    }
    try {
      await workspaceService.update(id, { name: workspaceName.trim() });
      mutateWorkspace();
      mutate("my-workspaces");
      setIsEditing(false);
    } catch (err) {
      console.error("Ошибка при переименовании workspace:", err);
      setWorkspaceName(data?.name || "");
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await workspaceService.delete(id);
      mutate("my-workspaces");
      localStorage.removeItem(`tasks-${id}`);
      localStorage.removeItem(`workspaceBackgroundImage-${id}`);
      navigate("/");
    } catch (err) {
      console.error("Ошибка при удалении workspace:", err);
    }
  };

  const addTask = useCallback((title: string) => {
    if (!title.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      title: title.trim(),
      cards: [],
    };
    setTasks((prev) => [...prev, newTask]);
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  }, []);

  const deleteCard = useCallback((taskId: string, cardId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, cards: task.cards.filter((c) => c.id !== cardId) }
          : task
      )
    );
  }, []);

  const addCard = useCallback((taskId: string, card: Card) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, cards: [...task.cards, card] } : task
      )
    );
  }, []);

  const updateCard = useCallback((taskId: string, card: Card) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              cards: task.cards.map((c) => (c.id === card.id ? card : c)),
            }
          : task
      )
    );
  }, []);

  const updateBlockTitle = useCallback((taskId: string, newTitle: string) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, title: newTitle } : task))
    );
  }, []);

  const moveCard = useCallback(
    (dragIndex: number, hoverIndex: number, fromTaskId: string, toTaskId: string) => {
      setTasks((prevTasks) => {
        const newTasks = prevTasks.map((task) => ({ ...task, cards: [...task.cards] }));
        const fromTask = newTasks.find((t) => t.id === fromTaskId);
        const toTask = newTasks.find((t) => t.id === toTaskId);
        if (!fromTask || !toTask) return prevTasks;

        let cardToMove;
        if (dragIndex === -1) {
          const fromCardIndex = fromTask.cards.length > 0 ? 0 : -1;
          if (fromCardIndex === -1) return prevTasks;
          [cardToMove] = fromTask.cards.splice(fromCardIndex, 1);
        } else {
          if (dragIndex >= fromTask.cards.length) return prevTasks;
          [cardToMove] = fromTask.cards.splice(dragIndex, 1);
        }
        toTask.cards.splice(hoverIndex, 0, cardToMove);
        return newTasks;
      });
    },
    []
  );

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      addTask(newTaskTitle);
      setNewTaskTitle("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleAddTask();
  };

  const handleCardImageSelect = useCallback(
    (url: string) => {
      if (currentCardId && id) {
        setTasks((prev) =>
          prev.map((task) => ({
            ...task,
            cards: task.cards.map((card) =>
              card.id === currentCardId ? { ...card, selectedImage: url } : card
            ),
          }))
        );
      }
      setIsCardImagePopupOpen(false);
    },
    [currentCardId, id]
  );

  // --- Рендер ---
  if (isLoading || !id) return null;

  return (
    <DndProvider backend={HTML5Backend}>
      <Menu />

      {/* Попап выбора фона */}
      {isImagePopupOpen && (
        <Popup
          onClose={() => setIsImagePopupOpen(false)}
          onSelectImage={handleSetBackgroundImage}
        />
      )}

      {/* Попап выбора изображения карточки */}
      {isCardImagePopupOpen && (
        <Popup
          onClose={() => setIsCardImagePopupOpen(false)}
          onSelectImage={handleCardImageSelect}
        />
      )}

      {/* Блок с фоном */}
      <Box
        key={backgroundImage} // Перерисовка при смене фона
        sx={{
          width: "100%",
          minHeight: "50px",
          height: backgroundImage ? "350px" : "50px",
          marginTop: backgroundImage ? "" : "50px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: "0 0 20px 20px",
          cursor: "pointer",
        }}
        onClick={() => setIsImagePopupOpen(true)}
      >
        <Typography
          sx={{
            fontFamily: "Unbounded",
            color: backgroundImage ? "#FFFFFF" : "#394D70",
            fontWeight: 900,
            opacity: 0.1,
          }}
        >
          Добавить изображение
        </Typography>
      </Box>

      <BaseLayout>
        {/* Заголовок workspace */}
        <Box sx={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
          {isEditing ? (
            <TextField
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRename();
                if (e.key === "Escape") {
                  setWorkspaceName(data?.name || "");
                  setIsEditing(false);
                }
              }}
              autoFocus
              size="small"
              sx={{ width: "300px" }}
            />
          ) : (
            <Typography
              variant="h3"
              sx={{
                fontSize: 40,
                fontWeight: 900,
                fontFamily: "Unbounded, sans-serif",
                color: "#394D70",
                cursor: "pointer",
                "&:hover": { opacity: 0.8 },
              }}
              onClick={() => setIsEditing(true)}
            >
              {workspaceName}
            </Typography>
          )}
          <IconButton
            sx={{
              color: "#394D70",
              marginLeft: "auto",
            }}
            onClick={() => setShowDeleteDialog(true)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>

        {/* Поле добавления задачи */}
        <Box sx={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
          <TextField
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Введите название задачи"
            sx={{ width: "90%" }}
            size="small"
          />
          <Button
            variant="contained"
            onClick={handleAddTask}
            sx={{
              backgroundColor: "#394D70",
              color: "#FFFFFF",
              fontWeight: 600,
              borderRadius: "10px",
              padding: "10px 20px",
            }}
          >
            add task
          </Button>
        </Box>

        {/* Блоки задач */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: "142px" }}>
          {tasks.map((task) => (
            <MakingBlock
              key={task.id}
              blockId={task.id}
              title={task.title}
              cards={task.cards}
              onDeleteCard={(cardId) => deleteCard(task.id, cardId)}
              onSelectImage={(cardId) => {
                setCurrentCardId(cardId);
                setIsCardImagePopupOpen(true);
              }}
              onUpdateTitle={(newTitle) => updateBlockTitle(task.id, newTitle)}
              onCardAdd={(card) => addCard(task.id, card)}
              onCardUpdate={(card) => updateCard(task.id, card)}
              onDeleteBlock={() => deleteTask(task.id)}
              moveCard={moveCard}
            />
          ))}
        </Box>
      </BaseLayout>

      {/* Диалог удаления */}
      <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
        <DialogTitle>Подтвердите удаление</DialogTitle>
        <DialogContent>
          <Typography>
            Вы уверены, что хотите удалить workspace{" "}
            <strong>"{workspaceName}"</strong>?
            <br />
            Все данные будут потеряны.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)} color="primary">
            Отмена
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </DndProvider>
  );
};