import { CSSProperties, PropsWithChildren } from "react";

export interface TextProps extends PropsWithChildren{
    variant?: 'bold' | 'light' | 'black'
    color?: string;
    styles?: CSSProperties
}