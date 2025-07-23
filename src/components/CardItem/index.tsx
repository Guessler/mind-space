import React from "react";
import { Box, IconButton, TextField } from "@mui/material";
import { useDrag, useDrop, DragSourceMonitor, DropTargetMonitor } from "react-dnd";
import cross from "../../assets/svg/cross.svg";
import { images } from "../../modules/exports/images";

export type Card = {
  id: string;
  selectedImage: string | null;
  taskTitle?: string;
  taskDescription?: string;
};

const ITEM_TYPE = "CARD";

interface CardItemProps {
  card: Card;
  taskId: string;
  index: number;
  moveCard: (dragIndex: number, hoverIndex: number, fromTaskId: string, toTaskId: string) => void;
  onSelectImage: (cardId: string) => void;
  onDelete: () => void;
  onUpdateTitle: (title: string) => void;
  onUpdateDescription: (description: string) => void;
}

export const CardItem: React.FC<CardItemProps> = ({
  card,
  taskId,
  index,
  moveCard,
  onSelectImage,
  onDelete,
  onUpdateTitle,
  onUpdateDescription,
}) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const [, drop] = useDrop({
    accept: ITEM_TYPE,
    hover: (item: { index: number; taskId: string }, monitor: DropTargetMonitor) => {
      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;
      const dragTaskId = item.taskId;
      const hoverTaskId = taskId;

      if (dragIndex === hoverIndex && dragTaskId === hoverTaskId) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const clientOffset = monitor.getClientOffset();

      if (!clientOffset) return;

      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveCard(dragIndex, hoverIndex, dragTaskId, hoverTaskId);
      item.index = hoverIndex;
      item.taskId = hoverTaskId;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: { index, taskId, id: card.id },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <Box
      ref={ref}
      data-card-id={card.id}
      sx={{
        width: "100%",
        background: "#F5F5F5",
        borderRadius: "20px",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        gap: "10px",
        padding: 0,
        cursor: "grab",
        opacity: isDragging ? 0.5 : 1,
        transform: isDragging ? "scale(1.02)" : "none",
        zIndex: isDragging ? 10 : "auto",
        "&:active": { cursor: "grabbing" },
        pointerEvents: "auto",
        marginBottom: "10px",
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
          padding: 0,
          position: "relative",
        }}
      >
        <img
          onClick={() => onSelectImage(card.id)}
          src={cross}
          alt="select image"
          style={{ cursor: "pointer", zIndex: 1 }}
        />
        <IconButton
          onClick={handleDelete}
          sx={{ position: "absolute", top: 10, right: 10, padding: 0 }}
        >
          <Box component="img" src={images["bin"]} alt="delete" sx={{ width: 24, height: 24 }} />
        </IconButton>
      </Box>
      <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: "5px", padding: 0 }}>
        <TextField
          multiline
          placeholder="Task title"
          value={card.taskTitle || ""}
          onChange={(e) => onUpdateTitle(e.target.value)}
          minRows={1}
          maxRows={3}
          sx={{
            width: "100%",
            "& .MuiOutlinedInput-root": { border: "none", "& fieldset": { border: "none" } },
            "& .MuiInputBase-input": {
              fontWeight: 900,
              color: "#394D70",
            },
          }}
        />
        <TextField
          multiline
          placeholder="Task description"
          value={card.taskDescription || ""}
          onChange={(e) => onUpdateDescription(e.target.value)}
          minRows={1}
          maxRows={5}
          sx={{
            width: "100%",
            fontWeight: 600,
            color: "#394D70",
            opacity: 0.5,
            "& .MuiOutlinedInput-root": { border: "none", "& fieldset": { border: "none" } },
            "& .MuiInputBase-input": {
              fontWeight: 600,
              color: "#394D70",
            },
          }}
        />
      </Box>
    </Box>
  );
};