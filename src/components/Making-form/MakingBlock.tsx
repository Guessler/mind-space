import React from "react";
import { Box, Typography, IconButton, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDrop } from "react-dnd";
import { Card, CardItem } from "../CardItem";

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
  moveCard: (dragIndex: number, hoverIndex: number, fromTaskId: string, toTaskId: string) => void;
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
  moveCard,
}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editTitle, setEditTitle] = React.useState(title);

  const handleAddCard = () => {
    onCardAdd({
      id: Date.now().toString(),
      selectedImage: null,
      taskTitle: "",
      taskDescription: "",
    });
  };

  const handleDeleteCard = (cardId: string) => {
    setTimeout(() => {
      onDeleteCard(cardId);
    }, 50);
  };

  const [, drop] = useDrop({
    accept: "CARD",
    drop: () => ({ taskId: blockId }),
    hover: (item: { index: number; taskId: string }) => {
      const dragTaskId = item.taskId;
      if (dragTaskId === blockId) return;

      moveCard(item.index, 0, dragTaskId, blockId);
      item.taskId = blockId;
      item.index = 0;
    },
  });

  return (
    <Box
      ref={drop}
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
        border: "2px dashed transparent",
        "&:hover": {
          borderColor: "#394D70",
        },
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
        {cards.length === 0 ? (
          <Box
            sx={{
              minHeight: "60px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#aaa",
              fontSize: 14,
              fontStyle: "italic",
              border: "2px dashed #ddd",
              borderRadius: "10px",
              padding: "10px",
            }}
          >
            Перетащите сюда карточку
          </Box>
        ) : (
          cards.map((card, index) => (
            <React.Fragment key={card.id}>
              <Box
                sx={{
                  height: "10px",
                  background: "transparent",
                  border: "2px dashed #394D70",
                  borderRadius: "5px",
                  opacity: 0,
                  "&:hover": { opacity: 0.3 },
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => moveCard(-1, index, "", blockId)}
              />
              <CardItem
                card={card}
                taskId={blockId}
                index={index}
                moveCard={moveCard}
                onSelectImage={onSelectImage}
                onDelete={() => handleDeleteCard(card.id)}
                onUpdateTitle={(title) => onCardUpdate({ ...card, taskTitle: title })}
                onUpdateDescription={(desc) => onCardUpdate({ ...card, taskDescription: desc })}
              />
            </React.Fragment>
          ))
        )}
      </Box>

      <Box
        sx={{
          height: "10px",
          background: "transparent",
          border: "2px dashed #394D70",
          borderRadius: "5px",
          opacity: 0,
          width: "100%",
          "&:hover": { opacity: 0.3 },
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={() => moveCard(-1, cards.length, "", blockId)}
      />

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