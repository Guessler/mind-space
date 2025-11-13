import { Request, Response } from "express";
import { IWorkspaceManager } from "../interfaces/workspace";
import { AuthRequest } from "../types/express";
import { WorkspaceType } from "../types/workspace";

export class WorkSpaceController {
    constructor(private readonly manager: IWorkspaceManager) { }

    async create(req: AuthRequest, res: Response) {
        try {
            const { name } = req.body;
            const { type } = req.body 
            const payload = req.user;
            return res.json(await this.manager.create(type, name, payload));
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
            const { page = 1, limit = 100 } = req.query;
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
            const { name, type } = req.body;
            const payload = req.user;
    
            const updateData: any = {};
            if (name && typeof name === "string") {
                updateData.name = name.trim();
            }
            if (type) {
                updateData.type = type;
            }
    
            if (Object.keys(updateData).length === 0) {
                return res.status(400).json({ message: "No valid fields to update" });
            }
    
            const result = await this.manager.update(Number(id), updateData.name, updateData.type, payload);
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