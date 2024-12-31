import { Box, Typography, Drawer } from "@mui/material";
import { useReducer } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Paths } from "../../consts/routes";
import { images } from "../../modules/exports/images";

const toggleReducer = (prev: boolean) => !prev;

export const Menu = () => {
  const [isActive, setIsActive] = useReducer(toggleReducer, false);
  const navigate = useNavigate();
  const [openSidebar, setOpenSidebar] = useReducer(toggleReducer, false);

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
        <Box onClick={() => setOpenSidebar()} component="img" src={images["Group 10"]} alt="Burger icon" />
        <Box component="img" src={images["Vector 1"]} alt="Arrow icon" onClick={handleArrowClick} style={{ cursor: "pointer" }} />
      </Box>

      {/* Правая часть меню */}
      <Box sx={{ marginRight: "20px", gap: "40px", display: "flex", alignItems: "center" }}>
        <Box sx={{cursor: "pointer"}} component="img" src={images["moon"]} alt="moon" />
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

      {/* Сайдбар с использованием Drawer */}
      <Drawer
        anchor="left"
        open={openSidebar}
        onClose={() => setOpenSidebar()}
        sx={{
          "& .MuiDrawer-paper": {
            width: "380px",
            backgroundColor: "#394D70",
            borderRadius: "0 20px 20px 0",
            padding: "20px",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "60px",
          }}
        >
          {/* Блок с информацией о пользователе */}
          <Box sx={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <Box component="img" src={images["image 12"]} alt="User icon" style={{ width: "50px", height: "50px" }} />
            <Box>
              <Typography sx={{ color: "white", fontFamily: "Unbounded", fontSize: "24px" }}>
                User name
              </Typography>
              <Typography sx={{ color: "#7D8898", fontFamily: "Unbounded" }}>
                user@mail.com
              </Typography>
            </Box>
          </Box>

          {/* Основное меню */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: "30px" }}>
            <Typography sx={{ display: "flex", gap: "50px", color: "white", fontFamily: "Unbounded", fontSize: "24px" }}>
              <Box src={images["Vector"]} alt="Home icon" component="img" /> Home page
            </Typography>
            <Typography sx={{ display: "flex", gap: "50px", color: "white", fontFamily: "Unbounded", fontSize: "24px" }}>
              <Box src={images["Vector-1"]} alt="Search icon" component="img" /> Search
            </Typography>
            <Typography sx={{ display: "flex", gap: "50px", color: "white", fontFamily: "Unbounded", fontSize: "24px" }}>
              <Box src={images["Vector-2"]} alt="Friends icon" component="img" /> Friends
            </Typography>
            <Typography sx={{ display: "flex", gap: "50px", color: "white", fontFamily: "Unbounded", fontSize: "24px" }}>
              <Box src={images["log out"]} alt="Logout icon" component="img" /> Quit
            </Typography>
          </Box>

          {/* Подменю */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "40px" }}>
            <Typography sx={{ color: "#7D8898", fontFamily: "Unbounded", fontSize: "18px" }}>
              Settings
            </Typography>
            <Typography sx={{ color: "#7D8898", fontFamily: "Unbounded", fontSize: "18px" }}>
              Help
            </Typography>
            <Typography sx={{ color: "#7D8898", fontFamily: "Unbounded", fontSize: "18px" }}>
              About
            </Typography>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};