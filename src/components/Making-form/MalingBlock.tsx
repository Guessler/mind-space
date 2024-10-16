import { Box, Input, Typography } from "@mui/material";
import { ReactNode, useEffect, useRef, useState } from "react";
import cross from "../../assets/cross.svg";
import {Popup} from "../Popup"

interface MakingBlockProps {
    children?: ReactNode;
    // taskName: string;
    // taskDescription: string;
}

export const MakingBlock: React.FC<MakingBlockProps> = ({ children }) => {
    const [addCard, setAddCard] = useState<boolean>(false);
    const [newInput, setNewInput] = useState<boolean>(false);
    const [taskName, setTaskName] = useState<string>('Write the name of the task');
    const [taskDescription, setTaskDescription] = useState<string>('Write what you need to do');
    const [editDescription, setEditDescription] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const descriptionInputRef = useRef<HTMLInputElement>(null);
    const [showPopup, setShowPopup] = useState<boolean>(false);

    useEffect(() => {
        if (newInput && inputRef.current) {
            inputRef.current.focus();
        }
    }, [newInput]);

    useEffect(() => {
        if (editDescription && descriptionInputRef.current) {
            descriptionInputRef.current.focus();
        }
    }, [editDescription]);

    const handleBlurTask = () => {
        setNewInput(false);
    };

    const handleBlurDescription = () => {
        setEditDescription(false);
    };

    const handleKeyDownTask = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            setNewInput(false);
        }
    };

    const handleKeyDownDescription = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            setEditDescription(false);
        }
    };

    const handleClosePopup = () => {
        setShowPopup(false); // Закрываем попап
      };
    return (
        <Box sx={{
            width: "360px", minHeight: "50px", borderRadius: "10px" ,padding: "10px", gap: "10px", boxShadow: '0px 0px 60px rgba(0, 0, 0, 0.2)',
            background: "#FFFFF", display: "flex", flexDirection: "column", alignItems: "flex-start"
        }}>
            {showPopup &&
                <Popup
                onClose={handleClosePopup}
                />
            }
            <Typography sx={{
                fontFamily: 'Unbounded, sans-serif',
                fontSize: 20,
                fontWeight: "900",
                lineHeight: 1.1,
                mb: '-4px',
                color: "#394D70"
            }}>
                {children}
            </Typography>
            {addCard &&
                <Box sx={{
                    width: "100%",
                    minHeight: "230px",
                    background: "#F5F5F5",
                    borderRadius: "20px",
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    gap: "10px",
                }}>
                    <Box sx={{ width: "100%", minHeight: "130px", background: "#7D8AA1", borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <img onClick={()=>{setShowPopup(true)}} style={{cursor: "pointer"}} src={cross} alt={cross} />
                    </Box>
                    <Box sx={{ width: "90%", gap: "20px", display: "flex", flexDirection: "column", textAlign: "left" }}>

                        {newInput ? (
                            <Input
                                sx={{
                                    width: "100%",
                                    border: "none",
                                    outline: "none",
                                    fontFamily: 'Unbounded, sans-serif',
                                    fontWeight: "900",
                                }}
                                ref={inputRef}
                                value={taskName}
                                onChange={(e) => setTaskName(e.target.value)}
                                onBlur={handleBlurTask}
                                onKeyDown={handleKeyDownTask}
                            />
                        ) : (
                            <Typography
                                onClick={() => setNewInput(true)}
                                sx={{
                                    fontFamily: 'Unbounded, sans-serif',
                                    fontWeight: "900",
                                    color: "#394D70",
                                    cursor: "pointer",
                                    wordBreak: "break-word",
                                    maxWidth: "100%"
                                }}
                            >
                                {taskName}
                            </Typography>
                        )}

                        {editDescription ? (
                            <Input
                                sx={{
                                    width: "100%",
                                    border: "none",
                                    outline: "none",
                                    fontWeight: "900",
                                }}
                                ref={descriptionInputRef}
                                value={taskDescription}
                                onChange={(e) => setTaskDescription(e.target.value)}
                                onBlur={handleBlurDescription}
                                onKeyDown={handleKeyDownDescription}
                            />
                        ) : (
                            <Typography
                                onClick={() => setEditDescription(true)}
                                sx={{
                                    color: "#394D70",
                                    fontWeight: "700",
                                    opacity: 0.5,
                                    cursor: "pointer",
                                    wordBreak: "break-word",
                                    maxWidth: "100%"
                                }}
                            >
                                {taskDescription}
                            </Typography>
                        )}
                    </Box>
                </Box>
            }
            <Typography 
                onClick={() => { setAddCard(true); }}
                sx={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 20,
                    fontWeight: 500,
                    color: "#394D70",
                    opacity: 0.5,
                    cursor: "pointer"
                }}>
                Add Card+
            </Typography>
        </Box>
    );
};
