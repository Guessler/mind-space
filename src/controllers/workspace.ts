import { Request, Response } from "express";
import { IWorkspaceManager } from "../interfaces/workspace";
import { AuthRequest } from "../types/express";

export class WorkSpaceController {
    constructor(private readonly manager: IWorkspaceManager) { }

    async create(req: AuthRequest, res: Response) {
        try {
            const { name } = req.body;
            const payload = req.user;
            return res.json(await this.manager.create(name, payload));
        } catch (err) {
            const { message } = err as Error;
            return res.status(400).json({ message });
        }
    }

    async invite(req: AuthRequest, res: Response) {
        try {
            const { workspaceId, email } = req.body;
            const payload = req.user;
            return res.json(await this.manager.invite(workspaceId, email, payload));
        } catch (err) {
            const { message } = err as Error;
            return res.status(400).json({ message });
        }
    }

    async remove(req: AuthRequest, res: Response) {
        try {
            const { workspaceId, email } = req.body;
            const payload = req.user;
            return res.json(await this.manager.remove(workspaceId, email, payload));
        } catch (err) {
            const { message } = err as Error;
            return res.status(400).json({ message });
        }
    }

    async changeRole(req: AuthRequest, res: Response) {
        try {
            const { workspaceId, email, newRole } = req.body;
            const payload = req.user;
            return res.json(await this.manager.changeRole(workspaceId, email, newRole, payload));
        } catch (err) {
            const { message } = err as Error;
            return res.status(400).json({ message });
        }
    }

    async myWorkspaces(req: AuthRequest, res: Response) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const payload = req.user;
            return res.json(await this.manager.myWorkspaces(Number(page), Number(limit), payload));
        } catch (err) {
            const { message } = err as Error;
            return res.status(400).json({ message });
        }
    }

    async getById(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            const payload = req.user;
            return res.json(await this.manager.getById(Number(id), payload));
        } catch (err) {
            const { message } = err as Error;
            return res.status(400).json({ message });
        }
    }

    async updateWorkspace(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            const { name } = req.body;
            const payload = req.user;

            if (!name || typeof name !== "string") {
                return res.status(400).json({ message: "Invalid name" });
            }

            const result = await this.manager.update(Number(id), name.trim(), payload);
            return res.json(result);
        } catch (err) {
            const { message } = err as Error;
            return res.status(400).json({ message });
        }
    }

    async deleteWorkspace(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            const payload = req.user;
            await this.manager.delete(Number(id), payload);
            return res.status(204).send();
        } catch (err) {
            const { message } = err as Error;
            return res.status(400).json({ message });
        }
    }
}