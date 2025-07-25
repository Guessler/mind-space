import { Box,  } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { Paths } from "../../consts/routes";
import { images } from "../../modules/exports/images";


export const Menu = () => {
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
      <Box sx={{ marginLeft: "20px", gap: "40px", display: "flex", alignItems: "center" }}>
        <Box component="img" src={images["Vector 1"]} alt="Arrow" onClick={handleArrowClick} style={{ cursor: "pointer" }} />
      </Box>

      <Box sx={{ marginRight: "20px", gap: "40px", display: "flex", alignItems: "center" }}>
        {/* <Box sx={{ cursor: "pointer" }} component="img" src={images["moon"]} alt="moon" /> */}
        <Box component="img" onClick={handleClick} src={images["friends"]} alt="Friends" />
        <Link to={Paths.SignUp}>
          <Box component="img" src={images["free-icon-logout-3889524 1"]} alt="Logout" />
        </Link>
      </Box>
    </Box>
  );
};