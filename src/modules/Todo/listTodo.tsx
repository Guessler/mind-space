import * as React from "react";
import { useState } from "react";
// import {rows} from "./makeTask" 
import {
  DataGrid,
  GridColDef,
  GridSortModel,
} from "@mui/x-data-grid";

const rows = [
  { task: "222", time:"2020"}
]
const columns: GridColDef[] = [
  { field: "task", headerName: "Task"},
  {
    field: "dateNumber",
    headerName: "Time",
    type: "number",
  },

];



export default function ListTodo({ onSubmit }: { onSubmit: any;}) {
  // rows.push()
console.log(onSubmit)
  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: "lastName", sort: "asc" },
  ]);
  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pagination
        checkboxSelection
        sortModel={sortModel}
        onSortModelChange={setSortModel}
        onPaginationModelChange={console.log}
      />
    </div>
  );
}
