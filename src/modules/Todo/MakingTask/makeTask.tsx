import { FC, useState } from "react";
import { MAKE_TODO } from "../consts";
import { Button, TextField, Typography } from "@mui/material";

interface MakeTaskProps{
  onSubmit: (value: string) => void;
}

const MakeTask : FC<MakeTaskProps> = ({onSubmit}) =>  {
  const [todo, setTodo] = useState<string>("");

  const handleAddTask = () => {
    if (todo.trim() === "") {
      alert("Вы не написали задание");
      return;
    }

    onSubmit(todo.trim())
    setTodo("");
  };

  return (
    <>
      <Typography fontWeight={'bold'} marginTop={5}>{MAKE_TODO}</Typography>
      <div className="d-flex flex-row">
        <TextField
          placeholder="Название задачи"
          type="text"
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
          required
        />
        <Button variant="contained" onClick={handleAddTask}>
          Добавить
        </Button>
      </div>
    </>
  );
}

export default MakeTask;
