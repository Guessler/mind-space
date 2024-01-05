import { FC, useState } from "react";
import {
  DataGrid,
  GridSortModel,
} from "@mui/x-data-grid";
import { TaskType } from "./types";
import { columns } from "./consts";
import { Grid } from "@mui/material";
import { PageSizeOptions } from "../../consts/data";

interface ListTodoProps{
  rows: TaskType[];
}

const  ListTodo : FC<ListTodoProps> = ({rows}) =>  {
  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: "lastName", sort: "asc" },
  ]);
  const Test = onclick = () =>{
    console.log(rows[0].name);
  }
  return (
    <Grid container >
      <DataGrid
        rows={rows}
        columns={columns}
        pagination
        checkboxSelection
        sortModel={sortModel}
        onSortModelChange={setSortModel}
        onPaginationModelChange={console.log}
        pageSizeOptions={PageSizeOptions}
      />
    </Grid>
  );
}

export default ListTodo