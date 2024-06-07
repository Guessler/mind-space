import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Skeleton, Typography } from "@mui/material";
import { useEffect, useReducer, useState } from "react";
import { TaskType } from "../Todo/types";
import { todoService } from "../../services/todo";
function TodoPage() {
  const [isLoading, toggleIsLoading] = useReducer((prev) => !prev, false)
  const [data, setData] = useState<TaskType|undefined>(undefined)
  const params = useParams()
  useEffect(()=>{
    if(params?.id){
      toggleIsLoading()
      todoService.findFn(params?.id).then(value=>setData(value)).finally(() => toggleIsLoading())
    }
  },[params?.id])
  return (
    <div>
        <Link to="/">
          <h1>Назад</h1>
        </Link>
        <Typography>{isLoading ?  <Skeleton height={24} width={130}></Skeleton> : data?.name}</Typography>
    </div>
  );
}

export default TodoPage;
