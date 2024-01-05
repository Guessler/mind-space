import { FC, PropsWithChildren } from "react";
import Dialog from "@mui/material/Dialog";
import { Box } from "@mui/material";

interface ModalBoxProps extends PropsWithChildren{
  open: boolean;
  toggleOpen: () => void;
}

const ModalBox: FC<ModalBoxProps> = ({children, open, toggleOpen}) => (
  <Dialog open={open} onClose={toggleOpen}>
    <Box className="popup">
      {children}
    </Box>
  </Dialog>
)


export default ModalBox;
