import ListTodo from "./listTodo";
import MakeTask from "./makeTask";
import Sidebar from "./sidebar";
import { useEffect, useState } from "react";
import { TaskType } from "./types";
import useSWR, { mutate } from "swr";
import { todoService } from "../../services/todo";

function Todo() {

  const [limit, setLimit] = useState(25)
  const [page, setPage] = useState(1)

  const listFetcher = () => todoService.findItemsFn(page, limit)
  const {data, error, isLoading} = useSWR(`/todo/list`, listFetcher)

  const onSubmit = async (value: string) => {
    await todoService.createFn(value)
    mutate(listFetcher)
  };

  useEffect(() => {
    mutate(listFetcher)
  }, [limit,page])

  if(isLoading){ return null }

  return (
    <div className="d-flex flex-row">
      <Sidebar />
      <div className="slide d-flex items-center flex-col">
        <MakeTask onSubmit={onSubmit} />
        <ListTodo setPage={setPage} setLimit={setLimit} rows={(data?.data as TaskType[])} />
      </div>
    </div>
  );
}
export default Todo;
