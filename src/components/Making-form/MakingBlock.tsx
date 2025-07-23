// src/components/MakingBlock.tsx
import React, { useState } from "react";
import { Box, Typography, IconButton, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { CardItem } from "../CardItem";

interface Card {
  id: string;
  selectedImage: string | null;
  taskDescription?: string;
}

interface MakingBlockProps {
  blockId: string;
  title: string;
  cards: Card[];
  onDeleteCard: (cardId: string) => void;
  onSelectImage: (cardId: string) => void;
  onUpdateTitle: (newTitle: string) => void;
  onCardAdd: (card: Card) => void;
  onCardUpdate: (card: Card) => void;
  onDeleteBlock: () => void;
}

export const MakingBlock: React.FC<MakingBlockProps> = ({
  blockId,
  title,
  cards,
  onDeleteCard,
  onSelectImage,
  onUpdateTitle,
  onCardAdd,
  onCardUpdate,
  onDeleteBlock,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);

  const handleAddCard = () => {
    onCardAdd({
      id: Date.now().toString(),
      selectedImage: null,
      taskDescription: "",
    });
  };

  const handleUpdateTaskDescription = (cardId: string, description: string) => {
    const card = cards.find((c) => c.id === cardId);
    if (card) {
      onCardUpdate({ ...card, taskDescription: description });
    }
  };

  return (
    <Box
      className="making-block"
      data-block-id={blockId}
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
      <IconButton
        onClick={onDeleteBlock}
        sx={{
          position: "absolute",
          top: "10px",
          right: "10px",
          color: "#394D70",
        }}
      >
        <DeleteIcon />
      </IconButton>

      {isEditing ? (
        <TextField
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onBlur={() => {
            onUpdateTitle(editTitle);
            setIsEditing(false);
          }}
          autoFocus
          fullWidth
        />
      ) : (
        <Typography
          onClick={() => setIsEditing(true)}
          sx={{
            fontFamily: "Unbounded, sans-serif",
            fontSize: 20,
            fontWeight: 900,
            cursor: "pointer",
          }}
        >
          {title}
        </Typography>
      )}

      <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: "10px" }}>
        {cards.map((card) => (
          <CardItem
            key={card.id}
            card={card}
            onSelectImage={() => onSelectImage(card.id)}
            onDelete={() => onDeleteCard(card.id)}
            onUpdateDescription={(desc) => handleUpdateTaskDescription(card.id, desc)}
          />
        ))}
      </Box>

      <Typography
        onClick={handleAddCard}
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