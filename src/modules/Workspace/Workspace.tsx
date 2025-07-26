import React, { useState, useEffect, useCallback } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useParams, useNavigate } from "react-router-dom";
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
import { images } from "../../modules/exports/images";

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

  useEffect(() => {
    if (id) {
      const key = `workspaceBackgroundImage-${id}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        setBackgroundImage(JSON.parse(saved));
      } else {
        const tempBackground = images["black"];
        setBackgroundImage(tempBackground);
        localStorage.setItem(key, JSON.stringify(tempBackground));
      }
    }
  }, [id]);

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

  useEffect(() => {
    if (data?.name) {
      setWorkspaceName(data.name);
    }
  }, [data?.name]);

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
      {isCardImagePopupOpen && (
        <Popup
          onClose={() => setIsCardImagePopupOpen(false)}
          onSelectImage={handleCardImageSelect}
        />
      )}

      {/* Блок с фоном */}
      <Box
        key={backgroundImage}
        sx={{
          width: "100%",
          minHeight: "50px",
          height: {
            xs: backgroundImage ? "200px" : "50px",
            sm: backgroundImage ? "250px" : "50px",
            md: backgroundImage ? "350px" : "50px",
          },
          mt: {
            xs: backgroundImage ? "10px" : "50px",
            md: backgroundImage ? "0" : "50px",
          },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: "0 0 20px 20px",
          cursor: "pointer",
          position: "relative",
        }}
        onClick={() => setIsImagePopupOpen(true)}
      >
        <Typography
          sx={{
            fontFamily: "Unbounded",
            color: backgroundImage ? "#FFFFFF" : "#394D70",
            fontWeight: 900,
            opacity: 0.15,
            fontSize: {
              xs: "14px",
              sm: "16px",
              md: "18px",
            },
          }}
        >
          Добавить изображение
        </Typography>
      </Box>

      {/* Замена BaseLayout: просто Box с контролируемыми отступами */}
      <Box
        sx={{
          width: "100%",
          maxWidth: "100vw",
          px: {
            xs: "12px",
            sm: "16px",
            md: "24px",
          },
          boxSizing: "border-box",
          overflowX: "hidden",
        }}
      >
        {/* Заголовок workspace */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            gap: {
              xs: "10px",
              sm: "20px",
            },
            mb: "20px",
          }}
        >
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
              sx={{
                width: {
                  xs: "100%",
                  sm: "250px",
                  md: "300px",
                },
              }}
            />
          ) : (
            <Typography
              variant="h3"
              sx={{
                fontSize: {
                  xs: "24px",
                  sm: "32px",
                  md: "40px",
                },
                fontWeight: 900,
                fontFamily: "Unbounded, sans-serif",
                color: "#394D70",
                textAlign: {
                  xs: "center",
                  sm: "left",
                },
                width: {
                  xs: "100%",
                },
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
              ml: "auto",
              alignSelf: {
                xs: "center",
                sm: "flex-start",
              },
            }}
            onClick={() => setShowDeleteDialog(true)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Поле добавления задачи */}
        <Box
          sx={{
            display: "flex",
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            alignItems: "center",
            gap: {
              xs: "10px",
              sm: "10px",
            },
            mb: "30px",
          }}
        >
          <TextField
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Введите название задачи"
            sx={{
              width: {
                xs: "100%",
                sm: "70%",
                md: "80%",
              },
            }}
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
              width: {
                xs: "100%",
                sm: "auto",
              },
              py: {
                xs: "8px",
                sm: "6px",
              },
              fontSize: "14px",
            }}
          >
            add task
          </Button>
        </Box>

        {/* Блоки задач */}
        <Box
          sx={{
            display: "flex",
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            flexWrap: {
              xs: "nowrap",
              sm: "wrap",
            },
            gap: {
              xs: "20px",
              sm: "30px",
              md: "142px",
            },
            width: "100%",
          }}
        >
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
      </Box>

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