import { Box, Input, Typography } from "@mui/material";
import { ReactNode, useEffect, useRef, useState } from "react";
import cross from "../../assets/cross.svg";
import { Popup } from "../Popup";

interface Card {
  id: number;
  taskName: string;
  taskDescription: string;
  selectedImage: string | null;
}

interface MakingBlockProps {
  children?: ReactNode;
}

export const MakingBlock: React.FC<MakingBlockProps> = ({ children }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [newInputId, setNewInputId] = useState<number | null>(null);
  const [editDescriptionId, setEditDescriptionId] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const descriptionInputRef = useRef<HTMLInputElement>(null);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [currentCardId, setCurrentCardId] = useState<number | null>(null);

  useEffect(() => {
    if (newInputId !== null && inputRef.current) {
      inputRef.current.focus();
    }
  }, [newInputId]);

  useEffect(() => {
    if (editDescriptionId !== null && descriptionInputRef.current) {
      descriptionInputRef.current.focus();
    }
  }, [editDescriptionId]);

  const handleBlurTask = () => {
    setNewInputId(null);
  };

  const handleBlurDescription = () => {
    setEditDescriptionId(null);
  };
  const handleKeyDownTask = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>, id: number) => {
    if (e.key === "Enter") {
      setNewInputId(null);
    }
  };
  
  const handleKeyDownDescription = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>, id: number) => {
    if (e.key === "Enter") {
      setEditDescriptionId(null);
    }
  };
  

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
      taskName: "Write the name of the task",
      taskDescription: "Write what you need to do",
      selectedImage: null,
    };
    setCards((prevCards) => [...prevCards, newCard]);
  };

  const updateTaskName = (id: number, name: string) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === id ? { ...card, taskName: name } : card
      )
    );
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
        gap: "10px",
        boxShadow: "0px 0px 60px rgba(0, 0, 0, 0.2)",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
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
          mb: "-4px",
          color: "#394D70",
        }}
      >
        {children}
      </Typography>
      {cards.map((card) => (
        <Box
          key={card.id}
          sx={{
            width: "100%",
            height: "230px",
            background: "#F5F5F5",
            borderRadius: "20px",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <Box
            sx={{
              width: "100%",
              minHeight: "130px",
              background: card.selectedImage ? `url(${card.selectedImage})` : "#7D8AA1",
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
              <img
                onClick={() => {
                  setShowPopup(true);
                  setCurrentCardId(card.id);
                }}
                style={{ cursor: "pointer" }}
                src={cross}
                alt=""
              />
          </Box>
          <Box
            sx={{
              width: "90%",
              gap: "20px",
              display: "flex",
              flexDirection: "column",
              textAlign: "left",
            }}
          >
            {newInputId === card.id ? (
              <Input
                sx={{
                  width: "100%",
                  border: "none",
                  outline: "none",
                  fontFamily: "Unbounded, sans-serif",
                  fontWeight: "900",
                }}
                ref={inputRef}
                value={card.taskName}
                onChange={(e) => updateTaskName(card.id, e.target.value)}
                onBlur={handleBlurTask}
                onKeyDown={(e) => handleKeyDownTask(e, card.id)}
              />
            ) : (
              <Typography
                onClick={() => setNewInputId(card.id)}
                sx={{
                  fontFamily: "Unbounded, sans-serif",
                  fontWeight: "900",
                  color: "#394D70",
                  cursor: "pointer",
                  wordBreak: "break-word",
                  maxWidth: "100%",
                }}
              >
                {card.taskName}
              </Typography>
            )}
            {editDescriptionId === card.id ? (
              <Input
                sx={{
                  width: "100%",
                  border: "none",
                  outline: "none",
                  fontWeight: "900",
                }}
                ref={descriptionInputRef}
                value={card.taskDescription}
                onChange={(e) => updateTaskDescription(card.id, e.target.value)}
                onBlur={handleBlurDescription}
                onKeyDown={(e) => handleKeyDownDescription(e, card.id)}
              />
            ) : (
              <Typography
                onClick={() => setEditDescriptionId(card.id)}
                sx={{
                  color: "#394D70",
                  fontWeight: "700",
                  opacity: 0.5,
                  cursor: "pointer",
                  wordBreak: "break-word",
                  maxWidth: "100%",
                }}
              >
                {card.taskDescription}
              </Typography>
            )}
          </Box>
        </Box>
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
        }}
      >
        Add Card+
      </Typography>
    </Box>
  );
};
