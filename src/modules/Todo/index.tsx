import BasicTable from "./todoPage"
import MakeTask from './makeTask'
import Sidebar from "./sidebar"
function Todo(){
    return(
        <div className="d-flex flex-row" >
        <Sidebar/>
        <div className="slide d-flex items-center flex-col">
        <MakeTask/>
        <BasicTable/>
        </div>
        </div>
    )
}
export default Todo