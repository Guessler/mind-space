import { Box, Typography } from "@mui/material";
import { ReactNode, useEffect, useRef, useState } from "react";
import { Popup } from "../Popup";
import { CardItem } from "../CardItem";
import Sortable from "sortablejs";

interface Card {
  id: number;
  selectedImage: string | null;
  taskDescription?: string; // Добавлено для описания задачи
}

interface MakingBlockProps {
  children?: ReactNode;
  groupName: string; // Группа для Sortable
  onCardMove?: (card: Card, from: number, to: number) => void; // Коллбэк для перетаскивания
}

export const MakingBlock: React.FC<MakingBlockProps> = ({ children, groupName, onCardMove }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [editDescriptionId] = useState<number | null>(null);
  const descriptionInputRef = useRef<HTMLInputElement>(null);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [currentCardId, setCurrentCardId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sortableInstance = useRef<Sortable | null>(null);

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
            setCards(newCards);
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
      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === currentCardId ? { ...card, selectedImage: url } : card
        )
      );
    }
    setShowPopup(false);
  };

  const addNewCard = () => {
    const newCard: Card = {
      id: Date.now(),
      selectedImage: null,
    };
    setCards((prevCards) => [...prevCards, newCard]);
  };

  const updateTaskDescription = (id: number, description: string) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === id ? { ...card, taskDescription: description } : card
      )
    );
  };

  return (
    <Box
      sx={{
        width: "360px",
        minHeight: "50px",
        borderRadius: "10px",
        padding: "10px",
        boxShadow: "0px 0px 60px rgba(0, 0, 0, 0.2)",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "10px",
      }}
    >
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
        }}
      >
        {children}
      </Typography>

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