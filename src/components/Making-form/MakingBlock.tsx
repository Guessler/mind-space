import React, { useState, useRef } from "react";
import {
  Box,
  Typography,
  IconButton,
  TextField,
  useTheme,
  alpha,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
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
  moveCard: (
    dragIndex: number,
    hoverIndex: number,
    fromTaskId: string,
    toTaskId: string
  ) => void;
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
  const theme = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);

  // ✅ Предотвращаем множественный перенос одной карточки
  const lastMovedCardRef = useRef<{ id: string; fromTaskId: string } | null>(null);

  const handleAddCard = () => {
    onCardAdd({
      id: Date.now().toString(),
      selectedImage: null,
      taskTitle: "",
      taskDescription: "",
    });
  };

  const [, drop] = useDrop({
    accept: "CARD",
    drop: () => ({ taskId: blockId }),
    hover: (item: { id: string; index: number; taskId: string }) => {
      const { id: cardId, index: dragIndex, taskId: dragTaskId } = item;

      if (dragTaskId === blockId) return;

      // ✅ Переносим ТОЛЬКО ОДИН РАЗ
      if (
        lastMovedCardRef.current?.id === cardId &&
        lastMovedCardRef.current?.fromTaskId === dragTaskId
      ) {
        return;
      }

      moveCard(dragIndex, 0, dragTaskId, blockId);
      lastMovedCardRef.current = { id: cardId, fromTaskId: dragTaskId };

      // Обновляем item для других колонок
      item.taskId = blockId;
      item.index = 0;
    },
  });

  const handleDropAt = (index: number) => {
    moveCard(-1, index, "", blockId);
  };

  const handleDropAtEnd = () => {
    moveCard(-1, cards.length, "", blockId);
  };

  const handleDeleteCard = (cardId: string) => {
    setTimeout(() => {
      onDeleteCard(cardId);
    }, 50);
  };

  return (
    <Box
      ref={drop}
      data-block-id={blockId}
      sx={{
        width: 280,
        minWidth: 260,
        maxWidth: 320,
        flexShrink: 0,
        alignSelf: "flex-start",
        borderRadius: 2,
        p: 2,
        backgroundColor: theme.palette.background.paper,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 1.5,
        position: "relative",
        border: `2px dashed transparent`,
        transition: "border-color 0.2s ease",
        "&:hover": {
          borderColor: theme.palette.primary.main,
        },
      }}
    >
      <IconButton
        onClick={onDeleteBlock}
        size="small"
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          color: theme.palette.text.secondary,
          "&:hover": {
            color: theme.palette.error.main,
          },
        }}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>

      {isEditing ? (
        <TextField
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onBlur={() => {
            onUpdateTitle(editTitle.trim() || title);
            setIsEditing(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onUpdateTitle(editTitle.trim() || title);
              setIsEditing(false);
            } else if (e.key === "Escape") {
              setEditTitle(title);
              setIsEditing(false);
            }
          }}
          autoFocus
          variant="standard"
          fullWidth
          InputProps={{
            sx: {
              fontSize: "1.125rem",
              fontWeight: 700,
              fontFamily: "Unbounded, sans-serif",
            },
          }}
        />
      ) : (
        <Typography
          onClick={() => setIsEditing(true)}
          sx={{
            fontFamily: "Unbounded, sans-serif",
            fontSize: "1.125rem",
            fontWeight: 700,
            color: theme.palette.text.primary,
            cursor: "pointer",
            py: 0.5,
            "&:hover": {
              color: theme.palette.primary.main,
            },
          }}
        >
          {title}
        </Typography>
      )}

      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 1,
          mt: 0.5,
        }}
      >
        {cards.length === 0 ? (
          <Box
            sx={{
              minHeight: 60,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: theme.palette.text.secondary,
              fontSize: "0.875rem",
              fontStyle: "italic",
              border: `2px dashed ${theme.palette.divider}`,
              borderRadius: 1.5,
              px: 1.5,
              py: 1,
              textAlign: "center",
            }}
          >
            Перетащите карточку сюда
          </Box>
        ) : (
          cards.map((card, index) => (
            <React.Fragment key={card.id}>
              <Box
                sx={{
                  height: 4,
                  width: "100%",
                  borderRadius: 1,
                  backgroundColor: "transparent",
                  opacity: 0,
                  "&:hover": {
                    opacity: 0.3,
                    backgroundColor: theme.palette.primary.main,
                  },
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
                onUpdateTitle={(title) =>
                  onCardUpdate({ ...card, taskTitle: title })
                }
                onUpdateDescription={(desc) =>
                  onCardUpdate({ ...card, taskDescription: desc })
                }
              />
            </React.Fragment>
          ))
        )}

        <Box
          sx={{
            height: 4,
            width: "100%",
            borderRadius: 1,
            backgroundColor: "transparent",
            opacity: 0,
            "&:hover": {
              opacity: 0.3,
              backgroundColor: theme.palette.primary.main,
            },
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDropAtEnd}
        />
      </Box>

      <Box
        onClick={handleAddCard}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.75,
          mt: 1,
          py: 0.75,
          px: 1,
          borderRadius: 1,
          color: theme.palette.primary.main,
          fontSize: "0.9375rem",
          fontWeight: 500,
          cursor: "pointer",
          "&:hover": {
            backgroundColor: alpha(theme.palette.primary.main, 0.08),
          },
        }}
      >
        <AddIcon fontSize="small" />
        <Typography>Add Card</Typography>
      </Box>
    </Box>
  );
};