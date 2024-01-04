import BasicTable from "./todoPage"
import MakeTask from './makeTask'
import Sidebar from "./sidebar"
import { useState } from "react";
import { TaskType } from "./types";
function Todo(){

    const [tasks, setTasks] = useState<TaskType[]>([]);

    const onSubmit = (value: string) => {
        setTasks([...tasks, { id: tasks.length + 1, name: value, dateNumber: new Date().getTime() }]);
    }

    return(
        <div className="d-flex flex-row" >
            <Sidebar/>
            <div className="slide d-flex items-center flex-col">
                <MakeTask onSubmit={onSubmit} />
                <BasicTable/>
            </div>
        </div>
    )
}
export default Todo