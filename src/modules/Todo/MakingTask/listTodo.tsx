import { Dispatch, FC, SetStateAction, useReducer, useState } from "react";
import {
  DataGrid,
  GridCellParams,
  GridSortModel,
  GridTreeNode,
} from "@mui/x-data-grid";
import { TaskType } from "../types";
import { columns } from "../consts";
import { Grid, Typography } from "@mui/material";
import ModalBox from "../../../components/layouts/modalBox";
import { PageSizeOptions } from "../../../consts/data";
import { useNavigate } from "react-router-dom";

interface ListTodoProps {
  rows?: TaskType[];
  setLimit: Dispatch<SetStateAction<number>>;
  setPage: Dispatch<SetStateAction<number>>;
}

const ListTodo: FC<ListTodoProps> = ({ rows, setLimit, setPage }) => {
  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: "lastName", sort: "asc" },
  ]);
  const navigate = useNavigate();

  const [open, toggleOpen] = useReducer((prev) => !prev, false);
  const [activeRow, setActiveRow] = useState<undefined | TaskType>(undefined);

  const openModalTask = (params: GridCellParams<TaskType, unknown, unknown, GridTreeNode>) => {
    if (params.field === 'name') {
      setActiveRow(params.row);
      toggleOpen();
    }
  };

  return (
    <Grid container>
      <ModalBox open={open} toggleOpen={toggleOpen}>
        <Typography onClick={() => navigate(`/todo/${activeRow?.id}`)}>
          {activeRow?.name}
        </Typography>
      </ModalBox>
      <DataGrid
        rows={rows ?? []}
        columns={columns}
        sortModel={sortModel}
        onSortModelChange={setSortModel}
        onPaginationModelChange={paging => {
          setPage(paging.page)
          setLimit(paging.pageSize)
        }}
        pageSizeOptions={PageSizeOptions}
        onCellClick={openModalTask}
        disableRowSelectionOnClick
        checkboxSelection
        pagination
      />
    </Grid>
  );
};

export default ListTodo;
