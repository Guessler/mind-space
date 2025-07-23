import React from "react";
import { Box, IconButton, TextField } from "@mui/material";
import { useDrag, useDrop, DragSourceMonitor } from "react-dnd";
import cross from "../../assets/svg/cross.svg";
import { images } from "../../modules/exports/images";

export type Card = {
  id: string;
  selectedImage: string | null;
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
  onUpdateDescription: (description: string) => void;
}

export const CardItem: React.FC<CardItemProps> = ({
  card,
  taskId,
  index,
  moveCard,
  onSelectImage,
  onDelete,
  onUpdateDescription,
}) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const [, drop] = useDrop({
    accept: ITEM_TYPE,
    hover: (item: { index: number; taskId: string }) => {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      const dragTaskId = item.taskId;
      const hoverTaskId = taskId;

      if (dragIndex === hoverIndex && dragTaskId === hoverTaskId) return;

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
        "&:active": { cursor: "grabbing" },
        pointerEvents: "auto",
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
          style={{ position: "absolute", top: 5, left: 5, cursor: "pointer", zIndex: 1 }}
        />
        <IconButton
          onClick={handleDelete}
          sx={{ position: "absolute", top: 5, right: 5, padding: 0 }}
        >
          <Box component="img" src={images["bin"]} alt="delete" sx={{ width: 24, height: 24 }} />
        </IconButton>
      </Box>
      <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: "5px", padding: 0 }}>
        <TextField
          multiline
          placeholder="Write the name of the task"
          value={card.taskDescription || ""}
          onChange={(e) => onUpdateDescription(e.target.value)}
          minRows={1}
          maxRows={5}
          sx={{
            width: "100%",
            "& .MuiOutlinedInput-root": { border: "none", "& fieldset": { border: "none" } },
            "& .MuiInputBase-input": {
              padding: "10px",
              fontWeight: 900,
              color: "#394D70",
            },
          }}
        />
        <TextField
          multiline
          placeholder="Write what you need to do"
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
              padding: "10px",
              fontWeight: 600,
              color: "#394D70",
            },
          }}
        />
      </Box>
    </Box>
  );
};