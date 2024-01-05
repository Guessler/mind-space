import ListTodo from "./ListTodo";
import MakeTask from "./MakeTask";
import Sidebar from "./sidebar";
import { useState } from "react";
import { TaskType } from "./types";

function Todo() {
  const [tasks, setTasks] = useState<TaskType[]>([]);

  const onSubmit = (value: string) => {
    setTasks([
      ...tasks,
      { id: tasks.length + 1, name: value, dateNumber: new Date().getTime() },
    ]);
  };

  return (
    <div className="d-flex flex-row">
      <Sidebar />
      <div className="slide d-flex items-center flex-col">
        <MakeTask onSubmit={onSubmit} />
        <ListTodo rows={tasks} />
      </div>
    </div>
  );
}
export default Todo;
