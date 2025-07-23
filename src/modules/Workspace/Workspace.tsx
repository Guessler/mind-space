import React, { useState, useEffect, useCallback } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useParams } from "react-router-dom";
import { BaseLayout } from "../../layout/base";
import useSWR from "swr";
import { workspaceService } from "../../services/workspace.service";
import { Box, Typography, TextField, Button } from "@mui/material";
import { Popup } from "../../components/Popup";
import { Menu } from "../../components/Menu";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { Card } from "../../components/CardItem";
import { MakingBlock } from "../../components/Making-form";

type Task = {
  id: string;
  title: string;
  cards: Card[];
};

export const Workspace = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useSWR(`workspace-${id}`, () =>
    workspaceService.getById(id as string)
  );

  const [backgroundImage, setBackgroundImage] = useLocalStorage<string | null>(
    `workspaceBackgroundImage-${id}`,
    null
  );

  const [tasks, setTasks] = useState<Task[]>(() => {
    const stored = localStorage.getItem(`tasks-${id}`);
    return stored ? JSON.parse(stored) : [];
  });

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  const [isCardImagePopupOpen, setIsCardImagePopupOpen] = useState(false);
  const [currentCardId, setCurrentCardId] = useState<string | null>(null);

  // Сохранение в localStorage
  useEffect(() => {
    if (id) {
      localStorage.setItem(`tasks-${id}`, JSON.stringify(tasks));
    }
  }, [tasks, id]);

  // --- Управление задачами ---
  const addTask = useCallback(
    (title: string) => {
      if (!title.trim()) return;
      const newTask: Task = {
        id: Date.now().toString(),
        title: title.trim(),
        cards: [],
      };
      setTasks((prev) => [...prev, newTask]);
    },
    []
  );

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

  // --- DnD: Перемещение карточек между блоками ---
  const moveCard = useCallback(
    (dragIndex: number, hoverIndex: number, fromTaskId: string, toTaskId: string) => {
      setTasks((prevTasks) => {
        const newTasks = [...prevTasks];
        const fromTask = newTasks.find((t) => t.id === fromTaskId);
        const toTask = newTasks.find((t) => t.id === toTaskId);

        if (!fromTask || !toTask) return prevTasks;

        const [movedCard] = fromTask.cards.splice(dragIndex, 1);
        toTask.cards.splice(hoverIndex, 0, movedCard);

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
      if (currentCardId) {
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
    [currentCardId]
  );

  if (isLoading || !id) return null;

  return (
    <DndProvider backend={HTML5Backend}>
      <Menu />
      {isImagePopupOpen && (
        <Popup onClose={() => setIsImagePopupOpen(false)} onSelectImage={setBackgroundImage} />
      )}
      {isCardImagePopupOpen && (
        <Popup
          onClose={() => setIsCardImagePopupOpen(false)}
          onSelectImage={handleCardImageSelect}
        />
      )}
      <Box
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
          borderRadius: "0 0 20px 20px",
          backgroundPosition: "center",
        }}
      >
        <Typography
          onClick={() => setIsImagePopupOpen(true)}
          sx={{
            fontFamily: "Unbounded",
            color: backgroundImage ? "#FFFFFF" : "#394D70",
            fontWeight: 900,
            opacity: 0.1,
            cursor: "pointer",
          }}
        >
          Добавить изображение
        </Typography>
      </Box>
      <BaseLayout>
        <Typography
          variant="h3"
          sx={{
            fontSize: 40,
            fontWeight: 900,
            fontFamily: "Unbounded, sans-serif",
            color: "#394D70",
            marginBottom: "50px",
            marginTop: "20px",
          }}
        >
          {data?.name}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
          <TextField
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Введите название задачи"
            fullWidth
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
            Добавить задачу
          </Button>
        </Box>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
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
    </DndProvider>
  );
};