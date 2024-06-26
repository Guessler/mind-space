import { FC } from "react";
import { TextProps } from "../../interfaces/form";
import { Typography } from "@mui/material";

export const Text: FC<TextProps> = ({children, variant, color, styles}) => {

    const variantUi = 
        variant === 'black' ? 'h1' : variant === 'bold' ? 'h2' : variant === 'light' ? 'body1' : 'subtitle2'

    return (
        <Typography sx={styles} color={color} variant={variantUi}>{children}</Typography>
    )
}