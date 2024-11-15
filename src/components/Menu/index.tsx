import { Box, Typography } from "@mui/material";
import flag from "../../assets/1677331596_bogatyr-club-p-flag-rf-trikolor-fon-vkontakte-6 1.svg";
import quit from "../../assets/free-icon-logout-3889524 1.svg";
import burger from "../../assets/Group 10.svg";
import arrow from "../../assets/Vector 1.svg";
import friends from "../../assets/friends.svg";
import britain from "../../assets/brit.svg";
import { useReducer } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Paths } from "../../consts/routes";

const toggleReducer = (prev: boolean) => !prev;

export const Menu = () => {
    const [isActive, setIsActive] = useReducer(toggleReducer, false);
    const navigate = useNavigate();  // Хук для навигации

    const handleClick = () => {
        alert("it's ready yet");
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
                top: 0,
                zIndex: 10,
            }}
        >
            <Box sx={{ marginLeft: "20px", gap: "40px", display: "flex", alignItems: "center" }}>
                <Box component="img" src={burger} alt="Burger icon" />
                <Box component="img" src={arrow} alt="Arrow icon" onClick={handleArrowClick} style={{ cursor: "pointer" }} />
            </Box>
            <Box sx={{ marginRight: "20px", gap: "40px", display: "flex", alignItems: "center" }}>
                <Box component="img" onClick={handleClick} src={friends} alt="Friends icon" />
                <Box
                    component="img"
                    onClick={() => setIsActive()}
                    src={flag}
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
                            русский <Box component="img" src={flag} alt="Russian flag" />
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
                            english <Box component="img" src={britain} alt="British flag" />
                        </Typography>
                    </Box>
                )}
                <Link to={Paths.SignUp}>
                    <Box component="img" src={quit} alt="Logout icon" />
                </Link>
            </Box>
        </Box>
    );
};
