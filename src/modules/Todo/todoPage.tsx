import * as React from "react";
import { useState } from "react";
import {rows} from "./makeTask" 
import {
  DataGrid,
  GridColDef,
  GridSortModel,
} from "@mui/x-data-grid";

const columns: GridColDef[] = [
  { field: "task", headerName: "Task"},
  {
    field: "dateNumber",
    headerName: "Time",
    type: "number",
  },

];



export default function DataTable() {
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
        onSortModelChange={(model) => setSortModel(model)}
      />
    </div>
  );
}
