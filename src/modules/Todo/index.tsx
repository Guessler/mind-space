import ListTodo from "./MakingTask/listTodo";
import MakeTask from "./MakingTask/makeTask";
import Sidebar from "./sidebar";
import { useEffect, useState } from "react";
import { TaskType } from "./types";
import useSWR, { mutate } from "swr";
import { todoService } from "../../services/todo";
import Loader from './Loader';

function Todo() {
  const [limit, setLimit] = useState(25)
  const [page, setPage] = useState(1)

  const listFetcher = () => todoService.findItemsFn(page, limit)
  const {data, isLoading} = useSWR(`/todo/list`, listFetcher)
  // error
  const onSubmit = async (value: string) => {
    await todoService.createFn(value)
    mutate(listFetcher)
  };

  useEffect(() => {
    mutate(listFetcher)
  }, [limit,page])

  if(isLoading){ return <Loader/> }

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
