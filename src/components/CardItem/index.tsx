import React from "react";
import { Box, TextField } from "@mui/material";
import cross from "../../assets/cross.svg";

interface Card {
  id: number;
  selectedImage: string | null;
}

interface CardItemProps {
  card: Card;
  onSelectImage: (id: number) => void;
  updateTaskDescription: (id: number, description: string) => void;
  descriptionInputRef: React.RefObject<HTMLInputElement>;
}

export const CardItem: React.FC<CardItemProps> = ({
  card,
  onSelectImage,
  updateTaskDescription,
  descriptionInputRef,
}) => {
  return (
    <Box
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
        cursor: "grab", // Курсор "grab" при наведении
        "&:active": {
          cursor: "grabbing", // Курсор "grabbing" при перетаскивании
        },
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
        }}
      >
        <img
          onClick={() => onSelectImage(card.id)}
          style={{ cursor: "pointer" }}
          src={cross}
          alt="close"
        />
      </Box>
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
        <TextField
          multiline
          placeholder="Write the name of the task"
          onChange={(e) => updateTaskDescription(card.id, e.target.value)}
          minRows={1}
          maxRows={5}
          inputRef={descriptionInputRef}
          sx={{
            width: "100%",
            "& .MuiOutlinedInput-root": {
              border: "none",
              padding: 0,
              "& fieldset": {
                border: "none",
              },
              "&:hover fieldset": {
                border: "none",
              },
              "&.Mui-focused fieldset": {
                border: "none",
              },
            },
            "& .MuiInputBase-input": {
              padding: "10px",
              fontWeight: 900,
              color: "#394D70",
              minHeight: "30px",
            },
          }}
        />
        <TextField
          sx={{
            width: "100%",
            fontWeight: "600",
            color: "#394D70",
            opacity: 0.5,
            "& .MuiOutlinedInput-root": {
              padding: 0,
              border: "none",
              "& fieldset": {
                border: "none",
              },
              "&:hover fieldset": {
                border: "none",
              },
              "&.Mui-focused fieldset": {
                border: "none",
              },
            },
            "& .MuiInputBase-input": {
              padding: "10px",
              fontWeight: "600",
              color: "#394D70",
              border: "none",
              minHeight: "30px",
            },
            "& .MuiInputBase-inputMultiline": {
              border: "none",
              padding: "10px",
            },
            height: "auto",
          }}
          placeholder="Write what you need to do"
          multiline
          minRows={1}
          maxRows={5}
          onChange={(e) => updateTaskDescription(card.id, e.target.value)}
          inputRef={descriptionInputRef}
        />
      </Box>
    </Box>
  );
};