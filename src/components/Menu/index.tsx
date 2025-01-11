import { Box, Typography } from "@mui/material";
import { useReducer } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Paths } from "../../consts/routes";
import { images } from "../../modules/exports/images";

const toggleReducer = (prev: boolean) => !prev;

export const Menu = () => {
  const [isActive, setIsActive] = useReducer(toggleReducer, false);
  const navigate = useNavigate();

  const handleClick = () => {
    alert("isn't ready yet");
  };

  const handleArrowClick = () => {
    navigate(-1);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "30px",
        backgroundColor: "#394D70",
        display: "flex",
        justifyContent: "space-between",
        position: "fixed",
        borderRadius: "0 0 10px 10px",
        top: 0,
        zIndex: 10,
      }}
    >
      {/* Левая часть меню */}
      <Box sx={{ marginLeft: "20px", gap: "40px", display: "flex", alignItems: "center" }}>
        <Box component="img" src={images["Vector 1"]} alt="Arrow icon" onClick={handleArrowClick} style={{ cursor: "pointer" }} />
      </Box>

      {/* Правая часть меню */}
      <Box sx={{ marginRight: "20px", gap: "40px", display: "flex", alignItems: "center" }}>
        <Box sx={{ cursor: "pointer" }} component="img" src={images["moon"]} alt="moon" />
        <Box component="img" onClick={handleClick} src={images["friends"]} alt="Friends icon" />
        <Box
          component="img"
          onClick={() => setIsActive()}
          src={images["1677331596_bogatyr-club-p-flag-rf-trikolor-fon-vkontakte-6 1"]}
          alt="Flag icon"
          sx={{ cursor: "pointer" }}
        />
        {isActive && (
          <Box
            sx={{
              background: "#394D70",
              borderRadius: "8px",
              padding: "10px",
              position: "fixed",
              top: "50px",
              right: "20px",
              gap: "10px",
              display: "flex",
              flexDirection: "column",
              zIndex: 20,
            }}
          >
            <Typography
              sx={{
                fontFamily: "Unbounded, sans-serif",
                fontSize: 16,
                fontWeight: 700,
                color: "#fff",
                display: "flex",
                justifyContent: "space-between",
                gap: "10px",
              }}
            >
              русский <Box component="img" src={images["1677331596_bogatyr-club-p-flag-rf-trikolor-fon-vkontakte-6 1"]} alt="Russian flag" />
            </Typography>

            <Typography
              sx={{
                fontFamily: "Unbounded, sans-serif",
                fontSize: 16,
                fontWeight: 700,
                color: "#fff",
                display: "flex",
                justifyContent: "space-between",
                gap: "10px",
              }}
            >
              english <Box component="img" src={images["brit"]} alt="British flag" />
            </Typography>
          </Box>
        )}
        <Link to={Paths.SignUp}>
          <Box component="img" src={images["free-icon-logout-3889524 1"]} alt="Logout icon" />
        </Link>
      </Box>
    </Box>
  );
};