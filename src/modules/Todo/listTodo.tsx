import { FC, useReducer, useState } from "react";
import {
  DataGrid,
  GridCellParams,
  GridSortModel,
  GridTreeNode,
} from "@mui/x-data-grid";
import { TaskType } from "./types";
import { columns } from "./consts";
import { Grid, Typography } from "@mui/material";
import { PageSizeOptions } from "../../consts/data";
import ModalBox from "../../components/layouts/modalBox";

interface ListTodoProps{
  rows: TaskType[];
}

const  ListTodo : FC<ListTodoProps> = ({rows}) =>  {

  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: "lastName", sort: "asc" },
  ]);

  const [open, toggleOpen] = useReducer((prev) => !prev, false)
  const [activeRow, setActiveRow] = useState<undefined | TaskType>(undefined)

  const openModalTask = (params: GridCellParams<TaskType, unknown, unknown, GridTreeNode>) => {
    if(params.field === 'name'){
      setActiveRow(params.row)
      toggleOpen()
    }
  }

  return (
    <Grid container >
      <ModalBox open={open} toggleOpen={toggleOpen} >
        <Typography>{activeRow?.name}</Typography>    
      </ModalBox>
      <DataGrid
        rows={rows}
        columns={columns}
        sortModel={sortModel}
        onSortModelChange={setSortModel}
        onPaginationModelChange={console.log}
        pageSizeOptions={PageSizeOptions}
        onCellClick={openModalTask}
        disableRowSelectionOnClick
        checkboxSelection
        pagination
      />
    </Grid>
  );
}

export default ListTodo