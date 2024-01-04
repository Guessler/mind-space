import React, { FC, useEffect, useState } from "react";
import { MAKE_TODO } from "./consts";
import { TaskType } from "./types";

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
      <h1>{MAKE_TODO}</h1>
      <div className="d-flex flex-row">
        <input
          type="text"
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
          maxLength={100}
        />
        <button onClick={handleAddTask}>
          Добавить
        </button>
      </div>
    </>
  );
}

export default MakeTask;
