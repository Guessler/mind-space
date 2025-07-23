"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authConroller = void 0;
class AuthController {
    constructor(authManager) {
        this.authManager = authManager;
    }
    async auth(req, res) {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            const result = await this.authManager.auth(token);
            return res.json({ token: result });
        }
        catch (err) {
            if (err.message === 'AUTH_FAILED') {
                return res.status(401).json({ message: "Аутентификация провалена. Пожалуйста, авторизуйтесь заново." });
            }
            return res.status(400).json({ message: err.message });
        }
    }
    async register(req, res) {
        try {
            const { name, email, password } = req.body;
            await this.authManager.regiter(name, email, password);
            // return res.json({token: result })
            return res.json({ message: "USER_REGISTERED" });
        }
        catch (err) {
            if (err.message === 'AUTH_FAILED') {
                return res.status(401).json({ message: "Аутентификация провалена. Пожалуйста, авторизуйтесь заново." });
            }
            return res.status(400).json({ message: err.message });
        }
    }
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const result = await this.authManager.login(email, password);
            return res.json(result);
        }
        catch (err) {
            if (err.message === 'AUTH_FAILED') {
                return res.status(401).json({ message: "Аутентификация провалена. Пожалуйста, авторизуйтесь заново." });
            }
            return res.status(400).json({ message: err.message });
        }
    }
}
exports.authConroller = AuthController;
