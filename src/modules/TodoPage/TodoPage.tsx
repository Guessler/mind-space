import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { TaskType } from "../Todo/types";
import { todoService } from "../../services/todo";
function TodoPage() {
  const [data, setData] = useState<TaskType|undefined>(undefined)
  const params = useParams()
  useEffect(()=>{
    if(params?.id){
    todoService.findFn(params?.id).then(value=>setData(value)).finally()
    }
  },[])
  return (
    <div>
        <Link to="/">
          <h1>Назад</h1>
        </Link>
        <Typography>{data?.name}</Typography>
    </div>
  );
}

export default TodoPage;
