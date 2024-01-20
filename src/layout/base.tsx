import { FC, PropsWithChildren } from "react";

export const BaseLayout: FC<PropsWithChildren> = ({children}) => (
    <div style={{background: 'red'}}>{children}</div>
)