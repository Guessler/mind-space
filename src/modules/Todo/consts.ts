import { GridColDef } from "@mui/x-data-grid";

export const MAKE_TODO = "Напишите задание"

export const columns: GridColDef[] = [
    { field: "name", headerName: "Task"},
    {
      field: "dateNumber",
      headerName: "Time",
      type: "number",
    },
  ];
  