"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthManager = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
class AuthManager {
    constructor(authStore) {
        this.authStore = authStore;
        if (!process.env.SECRET_KEY_JWT) {
            throw new Error('CHOOSE SECRET_KEY_JWT in .env');
        }
        this.hashSteps = 5;
        this.key = process.env.SECRET_KEY_JWT;
    }
    generateToken(id, name, email) {
        return jsonwebtoken_1.default.sign({ id, name, email }, this.key, { expiresIn: '1d' });
    }
    async auth(token) {
        if (!token) {
            throw new Error("UNATHORIZED");
        }
        const session = await this.authStore.getSession(token);
        if (!session) {
            throw new Error("SESSION_NOT_FOUND");
        }
        try {
            const decoded = jsonwebtoken_1.default.decode(session.token);
            if (decoded.id !== session.UserId) {
                await this.authStore.deleteSession(session.id);
                throw new Error("UNATHORIZED");
            }
            await this.authStore.deleteSession(session.id);
            const newGeneratedToken = this.generateToken(decoded.id, decoded.name, decoded.email);
            await this.authStore.createSession(newGeneratedToken, session.UserId);
            return newGeneratedToken;
        }
        catch (err) {
            await this.authStore.deleteSession(session.id);
            throw new Error("UNATHORIZED");
        }
    }
    async login(email, password) {
        if (!email) {
            throw new Error("CHOOSE_EMAIL");
        }
        if (!password) {
            throw new Error("CHOOSE_PASSWORD");
        }
        if (!this.isValidPassword(password)) {
            throw new Error("INCORRECT_PASSWORD");
        }
        const currentUser = await this.authStore.getUserByEmail(email);
        if (!currentUser) {
            throw new Error("USER_WITH_THIS_EMAIL_NOT_FOUND");
        }
        const isValidPassword = bcrypt_1.default.compareSync(password, currentUser.password);
        if (!isValidPassword) {
            throw new Error("INVALID_PASSWORD");
        }
        const { id, name } = currentUser;
        const token = this.generateToken(id, name, email);
        await this.authStore.createSession(token, id);
        return token;
    }
    isValidPassword(password) {
        const lowerCasePattern = /[a-z]/;
        const upperCasePattern = /[A-Z]/;
        const numberCasePattern = /[0-9]/;
        const specialCharacterPattern = /[^a-zA-Z0-9]/;
        return password.length >= 6 &&
            numberCasePattern.test(password) &&
            upperCasePattern.test(password) &&
            lowerCasePattern.test(password) &&
            specialCharacterPattern.test(password);
    }
    IsValidEmail(email) {
        const emailPattern = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
        return emailPattern.test(email);
    }
    async regiter(name, email, password) {
        if (!this.IsValidEmail(email)) {
            throw new Error("INCORRECT_EMAIL");
        }
        if (!this.isValidPassword(password)) {
            throw new Error("INCORRECT_PASSWORD");
        }
        const currentUser = await this.authStore.getUserByEmail(email);
        if (currentUser) {
            throw new Error("USER_WITH_THIS_EMAIL_IS_EXISTS");
        }
        const hashPassword = bcrypt_1.default.hashSync(password, this.hashSteps);
        await this.authStore.register(name, email, hashPassword);
        return true;
    }
}
exports.AuthManager = AuthManager;
