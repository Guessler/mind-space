import { Box, Typography } from "@mui/material";
import { useState } from "react";
import { images } from "../../modules/exports/images"; // Импорт изображений

interface Image {
  id: number;
  url: string;
  alt: string;
}

interface PopupProps {
  onClose: () => void;
  onSelectImage: (url: string) => void;
}

export const Popup: React.FC<PopupProps> = ({ onClose, onSelectImage }) => {
  const [imagesList] = useState<Image[]>([
    { id: 1, url: images["orenge"], alt: "Abstract geometric pattern" },
    { id: 2, url: images["1623781112_img0"], alt: "A beautiful sunset over a mountain range" },
    { id: 3, url: images["blue"], alt: "A calm beach with clear blue water" },
    { id: 5, url: images["black"], alt: "A dark and intense scene with blood splashes" },
  ]);

  const handleImageClick = (url: string) => {
    onSelectImage(url);
    onClose();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onSelectImage(reader.result as string);
        onClose();
      };
      reader.readAsDataURL(file);
    }
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
        {imagesList.map((image) => (
          <Box
            key={image.id}
            sx={{ width: 250, height: 200, m: 1, cursor: "pointer" }}
            onClick={() => handleImageClick(image.url)}
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
          onClick={() => document.getElementById("fileInput")?.click()}
        >
          <img src={images["your image"]} alt="Your" />
          <Typography
            sx={{
              fontFamily: 'Unbounded, sans-serif',
              fontSize: 24,
              color: "white",
              position: "absolute",
              mt: "120px",
            }}
          >
            Your image
          </Typography>
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </Box>
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
          onClick={() => handleImageClick("")}
        >
          <img src={images["none"]} alt="No" />
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