import { Link } from "react-router-dom"

import {Paths} from "../consts/routes"

export const PageNotFound = () => {
    return (
        <>
            <h1>Error 404</h1>
            <Link to={Paths.Home}></Link>
        </>
    )
}