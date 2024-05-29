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

UserModel.hasMany(SessionModel)
SessionModel.belongsTo(UserModel)
