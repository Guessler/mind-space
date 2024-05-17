import { DataTypes } from "sequelize";
import db from "..";

export const UserModel = db.define('User', {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    name: {type: DataTypes.TEXT},
    email: {type: DataTypes.TEXT, unique: true},
    password: {type: DataTypes.TEXT}
})
