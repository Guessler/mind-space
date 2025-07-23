"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.todo = void 0;
const express_1 = __importDefault(require("express"));
const router = (0, express_1.default)();
router.get('/', (req, res) => console.log('called todo method'));
router.get('/:id', (req, res) => console.log('called todo method'));
router.post('/', (req, res) => console.log('called auth method'));
router.put('/:id', (req, res) => console.log('called auth method'));
router.delete('/:id', (req, res) => console.log('called auth method'));
exports.todo = router;
