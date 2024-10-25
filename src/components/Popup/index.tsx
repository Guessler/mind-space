import { Box, Typography } from "@mui/material";
import { useState } from "react";
import photo2 from "../../assets/iconsForbg/krzysztof-kowalik-2pnozU26QBo-unsplash.jpg";
import photo3 from "../../assets/iconsForbg/michael-fousert-v96gcVQdTgU-unsplash.jpg";
import photo4 from "../../assets/iconsForbg/sora-sagano-8sOZJ8JF0S8-unsplash.jpg";
import photo5 from "../../assets/iconsForbg/premium_photo-1675344576121-81e305536fd3.jpg";
import blood from "../../assets/blood.png";
import none from "../../assets/none.svg";

interface Image {
  id: number;
  url: string;
  alt: string;
}

interface PopupProps {
  onClose: () => void;
  onSelectImage: (url: string) => void; // Добавляем callback для выбора изображения
}

export const Popup: React.FC<PopupProps> = ({ onClose, onSelectImage }) => {
  const [images] = useState<Image[]>([
    { id: 1, url: photo5, alt: "Abstract geometric pattern" },
    { id: 2, url: photo2, alt: "A beautiful sunset over a mountain range" },
    { id: 3, url: photo3, alt: "A calm beach with clear blue water" },
    { id: 4, url: photo4, alt: "A forest pathway with autumn leaves" },
    { id: 5, url: blood, alt: "A dark and intense scene with blood splashes" },
  ]);

  const handleImageClick = (url: string) => {
    onSelectImage(url); // Вызываем callback при выборе изображения
    onClose(); // Закрываем попап после выбора
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10,
      }}
      onClick={onClose}
    >
      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{
          width: 840,
          maxHeight: 700,
          padding: "20px",
          display: "flex",
          flexWrap: "wrap",
          bgcolor: "background.paper",
          borderRadius: "10px",
          gap: "20px",
          overflowY: "auto",
        }}
      >
        {images.map((image) => (
          <Box
            key={image.id}
            sx={{ width: 250, height: 200, m: 1, cursor: "pointer" }}
            onClick={() => handleImageClick(image.url)} // При клике на изображение вызываем функцию
          >
            <img
              src={image.url}
              alt={image.alt}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "20px",
              }}
            />
          </Box>
        ))}
        <Box
          sx={{
            width: 250,
            height: 200,
            background: "#D9D9D9",
            borderRadius: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            m: 1,
            cursor: "pointer",
            flexDirection: "column",
            position: "relative",
          }}
        >
          <img src={none} alt="No image" />
          <Typography
            sx={{
              fontFamily: 'Unbounded, sans-serif',
              fontSize: 24,
              color: "white",
              position: "absolute",
              mt: "120px",
            }}
          >
            No image
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
