"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkSpaceController = void 0;
class WorkSpaceController {
    constructor(manager) {
        this.manager = manager;
    }
    async create(req, res) {
        try {
            const { name } = req.body;
            const payload = req.user;
            return res.json(await this.manager.create(name, payload));
        }
        catch (err) {
            const { message } = err;
            return res.status(400).json({ message });
        }
    }
    async invite(req, res) {
        try {
            const { workspaceId, email } = req.body;
            const payload = req.user;
            return res.json(await this.manager.invite(workspaceId, email, payload));
        }
        catch (err) {
            const { message } = err;
            return res.status(400).json({ message });
        }
    }
    async remove(req, res) {
        try {
            const { workspaceId, email } = req.body;
            const payload = req.user;
            return res.json(await this.manager.remove(workspaceId, email, payload));
        }
        catch (err) {
            const { message } = err;
            return res.status(400).json({ message });
        }
    }
    async changeRole(req, res) {
        try {
            const { workspaceId, email, newRole } = req.body;
            const payload = req.user;
            return res.json(await this.manager.changeRole(workspaceId, email, newRole, payload));
        }
        catch (err) {
            const { message } = err;
            return res.status(400).json({ message });
        }
    }
    async myWorkspaces(req, res) {
        try {
            const { page, limit } = req.query;
            const payload = req.user;
            return res.json(await this.manager.myWorkspaces(Number(page), Number(limit), payload));
        }
        catch (err) {
            const { message } = err;
            return res.status(400).json({ message });
        }
    }
    async getById(req, res) {
        try {
            const { id } = req.params;
            const payload = req.user;
            return res.json(await this.manager.getById(Number(id), payload));
        }
        catch (err) {
            const { message } = err;
            return res.status(400).json({ message });
        }
    }
}
exports.WorkSpaceController = WorkSpaceController;
