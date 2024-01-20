import ListTodo from "./MakingTask/listTodo";
import MakeTask from "./MakingTask/makeTask";
import Sidebar from "./sidebar";
import { useCallback, useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import { todoService } from "../../services/todo";
import Loader from './Loader';
import { Backdrop } from "@mui/material";
import { BaseLayout } from "../../layout/base";


function Todo() {
  const [limit, setLimit] = useState(25)
  const [page, setPage] = useState(1)

  const listFetcher = useCallback(() => todoService.findItemsFn(page, limit), [limit, page])
  const {data, isLoading} = useSWR(`/todo/list`, listFetcher)
  const onSubmit = async (value: string) => {
    await todoService.createFn(value)
    mutate(listFetcher)
  };

  useEffect(() => {
    mutate(listFetcher)
  }, [limit, listFetcher, page])

  return (
    <BaseLayout>
      <div className="d-flex flex-row">
        <Backdrop open={isLoading} ><Loader/></Backdrop>
        <Sidebar />
        <div className="slide d-flex items-center flex-col">
          <MakeTask onSubmit={onSubmit} />
          <ListTodo setPage={setPage} setLimit={setLimit} rows={data?.data} />
        </div>
      </div>
    </BaseLayout>
  );
}
export default Todo;
