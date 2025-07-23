// src/modules/Workspace/Workspace.tsx
import { useParams } from "react-router-dom";
import { BaseLayout } from "../../layout/base";
import useSWR from "swr";
import { workspaceService } from "../../services/workspace.service";
import { useEffect, useRef, useState, useCallback } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import { Popup } from "../../components/Popup";
import { Menu } from "../../components/Menu";
import Sortable from "sortablejs";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { MakingBlock } from "../../components/Making-form";

type Card = { id: string; selectedImage: string | null; taskDescription?: string };
type Task = { id: string; title: string; cards: Card[] };

const useTasks = (workspaceId: string) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const storedTasks = localStorage.getItem(`tasks-${workspaceId}`);
    return storedTasks ? JSON.parse(storedTasks) : [];
  });

  useEffect(() => {
    localStorage.setItem(`tasks-${workspaceId}`, JSON.stringify(tasks));
  }, [tasks, workspaceId]);

  const addTask = useCallback((title: string) => {
    if (title.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        title: title.trim(),
        cards: [],
      };
      setTasks((prev) => [...prev, newTask]);
    }
  }, []);

  const moveCard = useCallback(
    (cardId: string, fromBlockId: string, toBlockId: string, newIndex: number) => {
      setTasks((prev) => {
        const newTasks = [...prev];
        const fromBlockIndex = newTasks.findIndex((b) => b.id === fromBlockId);
        const toBlockIndex = newTasks.findIndex((b) => b.id === toBlockId);
        if (fromBlockIndex === -1 || toBlockIndex === -1) return prev;

        const card = newTasks[fromBlockIndex].cards.find((c) => c.id === cardId);
        if (!card) return prev;

        newTasks[fromBlockIndex] = {
          ...newTasks[fromBlockIndex],
          cards: newTasks[fromBlockIndex].cards.filter((c) => c.id !== cardId),
        };

        newTasks[toBlockIndex] = {
          ...newTasks[toBlockIndex],
          cards: [
            ...newTasks[toBlockIndex].cards.slice(0, newIndex),
            card,
            ...newTasks[toBlockIndex].cards.slice(newIndex),
          ],
        };

        return newTasks;
      });
    },
    []
  );

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
          ? { ...task, cards: task.cards.map((c) => (c.id === card.id ? card : c)) }
          : task
      )
    );
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  }, []);

  const deleteCard = useCallback((taskId: string, cardId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, cards: task.cards.filter((card) => card.id !== cardId) }
          : task
      )
    );
  }, []);

  return {
    tasks,
    addTask,
    moveCard,
    addCard,
    updateCard,
    deleteTask,
    deleteCard,
    setTasks,
  };
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

  const {
    tasks,
    addTask,
    moveCard,
    addCard,
    updateCard,
    deleteTask,
    deleteCard,
    setTasks,
  } = useTasks(id || "");

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  const [isCardImagePopupOpen, setIsCardImagePopupOpen] = useState(false);
  const [currentCardId, setCurrentCardId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const sortableInstances = useRef<Sortable[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Уничтожаем старые инстансы
    sortableInstances.current.forEach((instance) => {
      try {
        instance.destroy();
      } catch (e) {
        console.warn("Failed to destroy Sortable instance", e);
      }
    });
    sortableInstances.current = [];

    const blocks = containerRef.current.querySelectorAll(".making-block");
    blocks.forEach((block) => {
      const sortable = new Sortable(block as HTMLElement, {
        group: "shared-group",
        animation: 150,
        delay: 0,
        delayOnTouchOnly: true,
        touchStartThreshold: 5,
        onEnd: (evt) => {
          const fromBlockId = evt.from.getAttribute("data-block-id");
          const toBlockId = evt.to.getAttribute("data-block-id");
          const cardId = evt.item.getAttribute("data-card-id");

          if (fromBlockId && toBlockId && cardId && evt.newIndex !== undefined) {
            moveCard(cardId, fromBlockId, toBlockId, evt.newIndex);
          }
        },
      });
      sortableInstances.current.push(sortable);
    });

    return () => {
      // Очистка при размонтировании
      sortableInstances.current.forEach((instance) => {
        try {
          instance.destroy();
        } catch (e) {
          console.warn("Failed to destroy Sortable on unmount", e);
        }
      });
      sortableInstances.current = [];
    };
  }, [tasks, moveCard]);

  const handleCardImageSelect = (url: string) => {
    if (currentCardId) {
      const updatedTasks = tasks.map((task) => ({
        ...task,
        cards: task.cards.map((card) =>
          card.id === currentCardId ? { ...card, selectedImage: url } : card
        ),
      }));
      setTasks(updatedTasks);
    }
    setIsCardImagePopupOpen(false);
  };

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      addTask(newTaskTitle);
      setNewTaskTitle("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleAddTask();
  };

  const handleUpdateBlockTitle = (taskId: string, newTitle: string) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, title: newTitle } : task))
    );
  };

  if (isLoading || !id) return null;

  return (
    <>
      <Menu />
      {isImagePopupOpen && (
        <Popup
          onClose={() => setIsImagePopupOpen(false)}
          onSelectImage={setBackgroundImage}
        />
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

        <Box ref={containerRef} sx={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
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
              onUpdateTitle={(newTitle: string) => handleUpdateBlockTitle(task.id, newTitle)}
              onCardAdd={(card: Card) => addCard(task.id, card)}
              onCardUpdate={(card: Card) => updateCard(task.id, card)}
              onDeleteBlock={() => deleteTask(task.id)}
            />
          ))}
        </Box>
      </BaseLayout>
    </>
  );
};