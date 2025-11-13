import { DataTypes } from "sequelize";
import db from "..";
import { WorkspaceType } from "../../../types/workspace";

export const UserModel = db.define('User', {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    name: {type: DataTypes.TEXT},
    email: {type: DataTypes.TEXT, unique: true},
    password: {type: DataTypes.TEXT}
})

export const SessionModel = db.define('Session', {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    token: {type: DataTypes.TEXT}
})

export const WorkspaceModel = db.define('Workspace', {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    name: {type: DataTypes.TEXT},
    type: {
        type: DataTypes.ENUM(...Object.values(WorkspaceType)),
        allowNull: false,
        defaultValue: WorkspaceType.TODO_LIST
    }
})

export const WorkspaceUserModel = db.define('WorkspaceUsers', {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    role: {type: DataTypes.TEXT},
    // Убираем type отсюда, если он общий для всего workspace
})

export const TodoModel = db.define('Todo', {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    name: {type: DataTypes.TEXT},
    isCompleted: {type: DataTypes.BOOLEAN, defaultValue: false} // Исправил на boolean
})

// Ассоциации
UserModel.hasMany(SessionModel)
SessionModel.belongsTo(UserModel)

UserModel.belongsToMany(WorkspaceModel, {through: WorkspaceUserModel})
WorkspaceModel.belongsToMany(UserModel, {through: WorkspaceUserModel})

WorkspaceModel.hasMany(TodoModel)
TodoModel.belongsTo(WorkspaceModel)