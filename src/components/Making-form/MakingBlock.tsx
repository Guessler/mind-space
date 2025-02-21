import { Box, Typography, TextField } from "@mui/material";
import { ReactNode, useEffect, useRef, useState } from "react";
import { Popup } from "../Popup";
import { CardItem } from "../CardItem";
import Sortable from "sortablejs";

interface Card {
  id: number;
  selectedImage: string | null;
  taskDescription?: string;
}

interface MakingBlockProps {
  children?: ReactNode;
  groupName: string;
  cards: Card[];
  onCardMove?: (card: Card, from: number, to: number) => void;
  onCardAdd?: (card: Card) => void;
  onCardUpdate?: (card: Card) => void;
  onDeleteBlock?: () => void;
  onUpdateTitle?: (title: string) => void; // Добавлено свойство для обновления названия
}

export const MakingBlock: React.FC<MakingBlockProps> = ({
  children,
  groupName,
  cards,
  onCardMove,
  onCardAdd,
  onCardUpdate,
  onDeleteBlock,
  onUpdateTitle, // Получаем функцию обновления названия
}) => {
  const [editDescriptionId] = useState<number | null>(null);
  const descriptionInputRef = useRef<HTMLInputElement>(null);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [currentCardId, setCurrentCardId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sortableInstance = useRef<Sortable | null>(null);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(children ? children.toString() : ""); // Состояние для названия
  const [isEditing, setIsEditing] = useState<boolean>(false); // Состояние для редактирования

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = event.target.value;
    setTitle(newTitle);
    if (onUpdateTitle) {
      onUpdateTitle(newTitle); // Вызываем функцию обновления названия
    }
  };

  const handleTitleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  useEffect(() => {
    if (editDescriptionId !== null && descriptionInputRef.current) {
      descriptionInputRef.current.focus();
    }

    if (containerRef.current) {
      sortableInstance.current = new Sortable(containerRef.current, {
        group: groupName,
        animation: 150,
        onEnd: (event) => {
          const { oldIndex, newIndex } = event;
          if (oldIndex !== undefined && newIndex !== undefined) {
            const newCards = [...cards];
            const [movedCard] = newCards.splice(oldIndex, 1);
            newCards.splice(newIndex, 0, movedCard);
            if (onCardMove) {
              onCardMove(movedCard, oldIndex, newIndex);
            }
          }
        },
      });
    }

    return () => {
      if (sortableInstance.current) {
        sortableInstance.current.destroy();
        sortableInstance.current = null;
      }
    };
  }, [cards, editDescriptionId, groupName, onCardMove]);

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleSelectImage = (url: string) => {
    if (currentCardId !== null) {
      const updatedCard = cards.find((card) => card.id === currentCardId);
      if (updatedCard) {
        const updatedCardWithImage = { ...updatedCard, selectedImage: url };
        if (onCardUpdate) {
          onCardUpdate(updatedCardWithImage);
        }
      }
    }
    setShowPopup(false);
  };

  const addNewCard = () => {
    const newCard: Card = {
      id: Date.now(),
      selectedImage: null,
    };
    if (onCardAdd) {
      onCardAdd(newCard);
    }
  };

  const updateTaskDescription = (id: number, description: string) => {
    const updatedCard = cards.find((card) => card.id === id);
    if (updatedCard) {
      const updatedCardWithDescription = { ...updatedCard, taskDescription: description };
      if (onCardUpdate) {
        onCardUpdate(updatedCardWithDescription);
      }
    }
  };

  return (
    <Box
      sx={{
        width: "360px",
        minHeight: "50px",
        borderRadius: "10px",
        padding: "10px",
        background: "#FFFFFF",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "10px",
        position: "relative",
      }}
    >

      <Typography
        onClick={onDeleteBlock}
        sx={{
          fontFamily: "Unbounded, sans-serif",
          position: "absolute",
          top: "10px",
          right: "10px",
          cursor: "pointer",
          color: "#394D70",
        }}
      >
        remove
      </Typography>

      {showPopup && (
        <Popup onClose={handleClosePopup} onSelectImage={handleSelectImage} />
      )}

      {isEditing ? (
        <TextField
          value={title}
          onChange={handleTitleChange}
          onBlur={handleBlur}
          autoFocus
          sx={{
            fontFamily: "Unbounded, sans-serif",
            fontSize: 20,
            fontWeight: "900",
            lineHeight: 1.1,
            color: "#394D70",
            margin: 0,
            width: "100%",
            "& .MuiOutlinedInput-root": {
              border: "none", // Убираем рамку
              boxShadow: "none", // Убираем тень
            },
            "& .MuiInputBase-input": {
              padding: 0, // Убираем отступы
            },
          }}
        />
      ) : (
        <Typography
          onClick={handleTitleClick}
          sx={{
            fontFamily: "Unbounded, sans-serif",
            fontSize: 20,
            fontWeight: "900",
            lineHeight: 1.1,
            color: "#394D70",
            margin: 0,
            cursor: "pointer",
          }}
        >
          {title}
        </Typography>
      )}

      {!isCollapsed && (
        <Box
          ref={containerRef}
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {Array.isArray(cards) && cards.length > 0 && cards.map((card) => (
            <CardItem
              key={card.id}
              card={card}
              onSelectImage={(id) => {
                setShowPopup(true);
                setCurrentCardId(id);
              }}
              updateTaskDescription={updateTaskDescription}
              descriptionInputRef={descriptionInputRef}
            />
          ))}
        </Box>
      )}

      <Typography
        onClick={addNewCard}
        sx={{
          fontFamily: "Inter, sans-serif",
          fontSize: 20,
          fontWeight: 500,
          color: "#394D70",
          opacity: 0.5,
          cursor: "pointer",
          margin: 0,
        }}
      >
        Add Card+
      </Typography>
    </Box>
  );
};
