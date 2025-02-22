import { Box, Typography } from "@mui/material";
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
  onDeleteBlock?: () => void; // Добавляем коллбэк для удаления блока
}

export const MakingBlock: React.FC<MakingBlockProps> = ({
  children,
  groupName,
  cards,
  onCardMove,
  onCardAdd,
  onCardUpdate,
  onDeleteBlock, // Добавляем коллбэк для удаления
}) => {
  const [editDescriptionId] = useState<number | null>(null);
  const descriptionInputRef = useRef<HTMLInputElement>(null);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [currentCardId, setCurrentCardId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sortableInstance = useRef<Sortable | null>(null);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
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
        sortableInstance.current.destroy(); // Удаляем Sortable при размонтировании
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
        onCardUpdate(updatedCardWithDescription); // Обновляем состояние через коллбэк
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
        position: "relative", // Добавляем позиционирование для кнопки удаления
      }}
    >

        <Typography
        onClick={onDeleteBlock} // Вызываем коллбэк для удаления
        sx={{
          fontFamily: "Unbounded, sans-serif",
          position: "absolute",
          top: "10px",
          right: "10px",
          cursor: "pointer",
          color: "#394D70",
        }}
        >remove</Typography>

      {showPopup && (
        <Popup onClose={handleClosePopup} onSelectImage={handleSelectImage} />
      )}

      <Typography
        sx={{
          fontFamily: "Unbounded, sans-serif",
          fontSize: 20,
          fontWeight: "900",
          lineHeight: 1.1,
          color: "#394D70",
          margin: 0,
          cursor: "pointer",
        }}
        onClick={handleToggleCollapse}
      >
        {children} {isCollapsed ? ">" : "v"}
      </Typography>

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