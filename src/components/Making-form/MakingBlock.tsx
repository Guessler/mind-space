import { Box, Typography } from "@mui/material";
import { ReactNode, useEffect, useRef, useState } from "react";
// import cross from "../../assets/cross.svg";
import { Popup } from "../Popup";
import { CardItem } from "../CardItem";

interface Card {
  id: number;
  selectedImage: string | null;
}

interface MakingBlockProps {
  children?: ReactNode;
}

export const MakingBlock: React.FC<MakingBlockProps> = ({ children }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [editDescriptionId] = useState<number | null>(null);
  const descriptionInputRef = useRef<HTMLInputElement>(null);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [currentCardId, setCurrentCardId] = useState<number | null>(null);

  useEffect(() => {
    if (editDescriptionId !== null && descriptionInputRef.current) {
      descriptionInputRef.current.focus();
    }
  }, [editDescriptionId]);

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
      {cards.map((card) => (
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