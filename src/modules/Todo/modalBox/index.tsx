import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";

function ModalBox() {

  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Open Modal
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <div className="popup">
        </div>
      </Dialog>
    </>
  );
}

export default ModalBox;
