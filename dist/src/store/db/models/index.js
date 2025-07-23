"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoModel = exports.WorkspaceUserModel = exports.WorkspaceModel = exports.SessionModel = exports.UserModel = void 0;
const sequelize_1 = require("sequelize");
const __1 = __importDefault(require(".."));
exports.UserModel = __1.default.define('User', {
    id: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: sequelize_1.DataTypes.TEXT },
    email: { type: sequelize_1.DataTypes.TEXT, unique: true },
    password: { type: sequelize_1.DataTypes.TEXT }
});
exports.SessionModel = __1.default.define('Session', {
    id: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    token: { type: sequelize_1.DataTypes.TEXT }
});
exports.WorkspaceModel = __1.default.define('Workspace', {
    id: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: sequelize_1.DataTypes.TEXT }
});
exports.WorkspaceUserModel = __1.default.define('WorkspaceUsers', {
    id: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    role: { type: sequelize_1.DataTypes.TEXT }
});
exports.TodoModel = __1.default.define('Todo', {
    id: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: sequelize_1.DataTypes.TEXT },
    isCompleted: { type: sequelize_1.DataTypes.BOOLEAN, defaultValue: 'false' }
});
exports.UserModel.hasMany(exports.SessionModel);
exports.SessionModel.belongsTo(exports.UserModel);
exports.UserModel.belongsToMany(exports.WorkspaceModel, { through: exports.WorkspaceUserModel });
exports.WorkspaceModel.belongsToMany(exports.UserModel, { through: exports.WorkspaceUserModel });
exports.WorkspaceModel.hasMany(exports.TodoModel);
exports.TodoModel.belongsTo(exports.WorkspaceModel);
