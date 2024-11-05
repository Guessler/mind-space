import { Box, Typography } from "@mui/material";
import { useState } from "react";
import photo2 from "../../assets/iconsForbg/1623781112_img0.jpg";
import photo3 from "../../assets/iconsForbg/wallpaperflare.com_wallpaper.jpg";
import photo5 from "../../assets/iconsForbg/wallpaperflare.com_wallpaper1.jpg";
import blood from "../../assets/iconsForbg/windows-11-dark-mode-abstract-background-black-background-3840x2160-8710.jpg";
import none from "../../assets/none.svg";
import yourImage from "../../assets/your image.svg"

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
  const [images] = useState<Image[]>([
    { id: 1, url: photo5, alt: "Abstract geometric pattern" },
    { id: 2, url: photo2, alt: "A beautiful sunset over a mountain range" },
    { id: 3, url: photo3, alt: "A calm beach with clear blue water" },
    { id: 5, url: blood, alt: "A dark and intense scene with blood splashes" },
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
        {images.map((image) => (
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
          <img src={yourImage} alt={yourImage} />
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
          <img src={none} alt={none} />
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