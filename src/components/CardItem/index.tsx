// src/components/CardItem.tsx
import React from "react";
import { Box, IconButton, TextField } from "@mui/material";
import cross from "../../assets/svg/cross.svg";
import { images } from "../../modules/exports/images";

interface Card {
  id: string;
  selectedImage: string | null;
  taskDescription?: string;
}

interface CardItemProps {
  card: Card;
  onSelectImage: () => void;
  onDelete: () => void;
  onUpdateDescription: (description: string) => void;
}

export const CardItem: React.FC<CardItemProps> = ({
  card,
  onSelectImage,
  onDelete,
  onUpdateDescription,
}) => {
  return (
    <Box
      className="card-item"
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
        transition: "all 0.3s ease",
        cursor: "grab",
        "&:active": {
          cursor: "grabbing",
        },
      }}
    >
      {/* Фоновая область с изображением и иконками */}
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
        {/* Иконка выбора изображения (крестик) */}
        <img
          onClick={onSelectImage}
          style={{ cursor: "pointer", top: 5, left: 5 }}
          src={cross}
          alt="select image"
        />
        {/* Иконка удаления */}
        <IconButton
          onClick={onDelete}
          sx={{ position: "absolute", top: 5, right: 5, padding: 0 }}
        >
          <Box component="img" src={images["bin"]} alt="delete" sx={{ width: 24, height: 24 }} />
        </IconButton>
      </Box>

      {/* Поля ввода: заголовок и описание */}
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          textAlign: "left",
          gap: "5px",
          padding: 0,
        }}
      >
        {/* Поле для названия задачи */}
        <TextField
          multiline
          placeholder="Write the name of the task"
          value={card.taskDescription || ""}
          onChange={(e) => onUpdateDescription(e.target.value)}
          minRows={1}
          maxRows={5}
          sx={{
            width: "100%",
            "& .MuiOutlinedInput-root": {
              border: "none",
              padding: 0,
              "& fieldset": { border: "none" },
              "&:hover fieldset": { border: "none" },
              "&.Mui-focused fieldset": { border: "none" },
            },
            "& .MuiInputBase-input": {
              padding: "10px",
              fontWeight: 900,
              color: "#394D70",
              minHeight: "30px",
            },
          }}
        />

        {/* Поле для описания задачи */}
        <TextField
          multiline
          placeholder="Write what you need to do"
          value={card.taskDescription || ""}
          onChange={(e) => onUpdateDescription(e.target.value)}
          minRows={1}
          maxRows={5}
          sx={{
            width: "100%",
            fontWeight: "600",
            color: "#394D70",
            opacity: 0.5,
            "& .MuiOutlinedInput-root": {
              padding: 0,
              border: "none",
              "& fieldset": { border: "none" },
              "&:hover fieldset": { border: "none" },
              "&.Mui-focused fieldset": { border: "none" },
            },
            "& .MuiInputBase-input": {
              padding: "10px",
              fontWeight: "600",
              color: "#394D70",
              minHeight: "30px",
            },
            "& .MuiInputBase-inputMultiline": {
              border: "none",
              padding: "10px",
            },
            height: "auto",
          }}
        />
      </Box>
    </Box>
  );
};