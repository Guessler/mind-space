import React, { useEffect, useState } from "react";
import { MAKE_TODO } from "./consts";

export const rows = [
  { id: 1, task: "test1", dateNumber: 2235 },
];

function MakeTask() {
  const [todo, setTodo] = useState<string>("");
  const [tasks, setTasks] = useState<typeof rows>([]);

  useEffect(() => {
    setTasks(rows);
  }, []);

  const handleAddTask = () => {
    if (todo.trim() === "") {
      alert("Вы не написали задание");
      return;
    }

    setTasks([...tasks, { id: tasks.length + 1, task: todo, dateNumber: new Date().getTime() }]);
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
      <ul className="decoration-none">
        {tasks.map((task, index) => (
          <li key={index} className="decoration-none">
            <input type="checkbox" /> {task.task}
          </li>
        ))}
      </ul>
    </>
  );
}

export default MakeTask;
