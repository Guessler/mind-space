import { IWebsocketManager } from "../interfaces/websockets";
import {Express, Request} from 'express'
import client from 'express-ws'
import { authSocket } from "../middleware/auth";
import { AuthRequest } from "../types/express";
import { UserModel, WorkspaceModel } from "../store/db/models";

type WebSocketClient = any
type ParsedMessage = {type: string, payload?: any}

export class WebsocketManager implements IWebsocketManager{
    ws: client.Instance
    clients: Map<number, WebSocketClient>
    userClients: Map<number, number[]>

    constructor(private readonly app: Express){
        this.ws = client(app);
        this.clients = new Map()
        this.userClients = new Map()
    }

    async init (): Promise<void>{
        this.ws.app.ws('/', async (ws: WebSocketClient,req: Request) => {

            const result = await authSocket(req)
            if(!result){
                ws.close()
                return 
            }

            ws.userId = Date.now()
            ws.user = (req as AuthRequest).user

            this.connectClient(ws)
            this.clients.set(ws.userId, ws)            
            this.notifyAll(JSON.stringify({type: "USER_CONNECTED", payload: {userId: ws.userId}}))

            ws.on('message', async(msg: string) => {

                const message = this.parseMessage(msg)
                if(message.type === "UNCAUGHT_MESSAGE"){
                    ws.send(message)
                    return
                }

                if(message.type === "WORKSPACE_CONNECTED"){
                    const id = message.payload.workspaceId
                    const data = await WorkspaceModel.findOne({
                        include: [{
                            model: UserModel,
                        }],
                        where: {
                            id
                        }
                    })

                    const userIds = data?.dataValues.Users.map((obj: any) => obj.dataValues.id)

                    const clients: number[] = []

                    for(const id of userIds){
                        const wsClients = this.userClients.get(id)
                        if(!wsClients){
                            continue
                        }

                        clients.push(...wsClients)
                    }

                    for(const clientId of clients){
                        const socket = this.clients.get(clientId)
                        socket.send(JSON.stringify({type: "USER_WORKSPACE_CONNECT", payload: {workspaceId: id, userId: ws.user.id, username: ws.user.name}}))
                    }

                    return
                }
                
                this.notifyAll(JSON.stringify({type: "USER_MESSAGE", payload: { userId: ws.userId, msg}}))
            })
        })
    };

    private parseMessage(msg: string):ParsedMessage {
        try{
            const parsed = JSON.parse(msg) as ParsedMessage
            return parsed
        }catch(err){
            return {type: "UNCAUGHT_MESSAGE"}
        }
    }

    private connectClient(ws: WebSocketClient){
        const clients = this.userClients.get(ws.user.id)
        if(!clients){
            this.userClients.set(ws.user.id, [ws.userId])
            return
        }

        this.userClients.set(ws.user.id, [...clients, ws.userId])
    }

    private notifyAll(msg: string){
        for(const client of this.clients.values()){
            client.send(msg)
        }
    }
}