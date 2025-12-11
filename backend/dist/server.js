"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
dotenv_1.default.config();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/gym_fitness";
async function start() {
    try {
        await mongoose_1.default.connect(MONGO_URI);
        console.log("Connected to MongoDB");
        const server = http_1.default.createServer(app_1.default);
        server.listen(PORT, () => {
            console.log(`API listening on port ${PORT}`);
        });
    }
    catch (error) {
        console.error("Failed to start server", error);
        process.exit(1);
    }
}
start();
//# sourceMappingURL=server.js.map