import { useReducer } from "react"
import ModalBox from "../../components/layouts/modalBox"
import { Button } from "@mui/material"

export const Test = () => {

    const [open, toggleOpen] = useReducer((prev) => !prev, true)

    return (
        <>
            <Button variant="contained" onClick={toggleOpen}>
                Open Modal
            </Button>
            <ModalBox 
                open={open}
                toggleOpen={toggleOpen}
            />
        </>
    )
}