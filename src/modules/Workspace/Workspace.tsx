import React, { useState, useEffect, useCallback, useRef } from "react";
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
import { WorkspaceType } from "../../types/workspace";
import { TodoList } from "../Home/components/TodoList";
import { DrawBoard } from "../Home/components/DrowBoard";

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

  // === Автоскролл при drag'е ===
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleDragStart = () => {
      isDraggingRef.current = true;
    };

    const handleDragEnd = () => {
      isDraggingRef.current = false;
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
        scrollIntervalRef.current = null;
      }
    };

    document.addEventListener("dragstart", handleDragStart);
    document.addEventListener("dragend", handleDragEnd);
    document.addEventListener("drop", handleDragEnd);
    document.addEventListener("mouseup", handleDragEnd);

    return () => {
      document.removeEventListener("dragstart", handleDragStart);
      document.removeEventListener("dragend", handleDragEnd);
      document.removeEventListener("drop", handleDragEnd);
      document.removeEventListener("mouseup", handleDragEnd);
    };
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const rect = container.getBoundingClientRect();
    const mouseX = e.clientX;

    const scrollZone = 120;
    const scrollSpeed = 60;
    const intervalMs = 8;

    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
    }

    if (mouseX < rect.left + scrollZone && container.scrollLeft > 0) {
      scrollIntervalRef.current = setInterval(() => {
        if (container.scrollLeft > 0) {
          container.scrollLeft -= scrollSpeed;
        } else {
          if (scrollIntervalRef.current) {
            clearInterval(scrollIntervalRef.current);
            scrollIntervalRef.current = null;
          }
        }
      }, intervalMs);
    } else if (
      mouseX > rect.right - scrollZone &&
      container.scrollLeft < container.scrollWidth - container.clientWidth
    ) {
      scrollIntervalRef.current = setInterval(() => {
        if (container.scrollLeft < container.scrollWidth - container.clientWidth) {
          container.scrollLeft += scrollSpeed;
        } else {
          if (scrollIntervalRef.current) {
            clearInterval(scrollIntervalRef.current);
            scrollIntervalRef.current = null;
          }
        }
      }, intervalMs);
    }
  }, []);

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

  // ✅ ИСПРАВЛЕНО: защита от повторных вызовов moveCard
  const moveCard = useCallback(
    (dragIndex: number, hoverIndex: number, fromTaskId: string, toTaskId: string) => {
      const moveKey = `${fromTaskId}-${toTaskId}-${dragIndex}-${hoverIndex}`;
      if ((moveCard as any).lastMoveKey === moveKey) {
        return;
      }
      (moveCard as any).lastMoveKey = moveKey;

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

  const renderWorkspaceContent = () => {
    switch (data?.type) {
      case WorkspaceType.TODO_LIST:
        return <TodoList />;

      case WorkspaceType.DROW_BOARD:
        return <DrawBoard />;

      case WorkspaceType.KANBAN_BOARD:
      default:
        return (
          <>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: "center",
                gap: 2,
                mb: 3,
              }}
            >
              <TextField
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Название колонки"
                size="small"
                fullWidth
                sx={{ width: "100%" }}
              />
              <Button
                variant="contained"
                onClick={handleAddTask}
                disabled={!newTaskTitle.trim()}
                sx={{
                  minWidth: 120,
                  fontWeight: 600,
                  borderRadius: "8px",
                  width: { xs: "100%", sm: "auto" },
                  mt: { xs: 1, sm: 0 },
                }}
              >
                Добавить
              </Button>
            </Box>

            <Box
              ref={scrollContainerRef}
              onDragOver={handleDragOver}
              sx={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "nowrap",
                gap: 2,
                width: "100%",
                overflowX: "auto",
                pb: 1,
                scrollBehavior: "smooth",
                minHeight: "calc(100vh - 200px)",
                "&::-webkit-scrollbar": {
                  height: 8,
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "rgba(0,0,0,0.3)",
                  borderRadius: 4,
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: "transparent",
                },
              }}
            >
{tasks.map((task) => (
  <MakingBlock
    key={task.id}
    blockId={task.id}
    title={task.title}
    cards={task.cards}
    onDeleteCard={(cardId: string) => deleteCard(task.id, cardId)}
    onSelectImage={(cardId: string) => {
      setCurrentCardId(cardId);
      setIsCardImagePopupOpen(true);
    }}
    onUpdateTitle={(newTitle: string) => updateBlockTitle(task.id, newTitle)}
    onCardAdd={(card: Card) => addCard(task.id, card)}
    onCardUpdate={(card: Card) => updateCard(task.id, card)}
    onDeleteBlock={() => deleteTask(task.id)}
    moveCard={moveCard}
  />
))}
              <Box sx={{ minWidth: 20, flexShrink: 0 }} />
            </Box>
          </>
        );
    }
  };

  if (isLoading || !id) return null;

  return (
    <DndProvider backend={HTML5Backend}>
      <Menu />

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

      <Box
        key={backgroundImage}
        sx={{
          width: "100%",
          minHeight: 50,
          height: backgroundImage ? { xs: 200, sm: 250, md: 300 } : 50,
          mt: backgroundImage ? { xs: 1, md: 0 } : 6,
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
            opacity: 0.2,
            fontSize: { xs: "14px", sm: "16px", md: "18px" },
          }}
        >
          {backgroundImage ? "Изменить фон" : "Добавить фон"}
        </Typography>
      </Box>

      <Box
        sx={{
          width: "100%",
          px: { xs: 2, sm: 3, md: 4 },
          boxSizing: "border-box",
          minHeight: "100vh",
          pb: 4,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            mb: 4,
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
              sx={{ width: { xs: "100%", sm: 300 } }}
            />
          ) : (
            <Typography
              variant="h4"
              sx={{
                fontSize: { xs: "24px", sm: "32px" },
                fontWeight: 800,
                fontFamily: "Unbounded, sans-serif",
                color: "#394D70",
                cursor: "pointer",
                textAlign: { xs: "center", sm: "left" },
                "&:hover": { opacity: 0.85 },
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
              alignSelf: { xs: "center", sm: "flex-start" },
            }}
            onClick={() => setShowDeleteDialog(true)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>

        {renderWorkspaceContent()}
      </Box>

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