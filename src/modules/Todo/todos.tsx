import React from "react";
import ContainerComponent from "./Container";
import { Link } from "react-router-dom";

function Todos() {
  return (
    <div>
      <ContainerComponent title="test123">
        <Link to="/">
          <h1>Назад</h1>
        </Link>
        <h2></h2>
      </ContainerComponent>
    </div>
  );
}

export default Todos;
