import { DataTypes } from "sequelize";
import db from "..";

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
    name: {type: DataTypes.TEXT}
})

export const WorkspaceUserModel = db.define('WorkspaceUsers', {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    role: {type: DataTypes.TEXT}
})

export const TodoModel = db.define('Todo', {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    name: {type: DataTypes.TEXT},
    isCompleted: {type: DataTypes.BOOLEAN, defaultValue: 'false'}
})

UserModel.hasMany(SessionModel)
SessionModel.belongsTo(UserModel)

UserModel.belongsToMany(WorkspaceModel, {through: WorkspaceUserModel})
WorkspaceModel.belongsToMany(UserModel, {through: WorkspaceUserModel})

WorkspaceModel.hasMany(TodoModel)
TodoModel.belongsTo(WorkspaceModel)