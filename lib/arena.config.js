"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const arena_1 = __importDefault(require("@colyseus/arena"));
/**
 * Import your Room files
 */
const PetitelaineRoom_1 = require("./rooms/PetitelaineRoom");
exports.default = arena_1.default({
    getId: () => "Your Colyseus App",
    initializeGameServer: (gameServer) => {
        /**
         * Define your room handlers:
         */
        gameServer.define("petitelaine", PetitelaineRoom_1.PetitelaineRoom).enableRealtimeListing();
    },
    initializeExpress: (app) => {
        /**
         * Bind your custom express routes here:
         */
        app.get("/", (req, res) => {
            res.send("It's time to kick ass and chew bubblegum!");
        });
        /**
         * Bind @colyseus/monitor
         * It is recommended to protect this route with a password.
         * Read more: https://docs.colyseus.io/tools/monitor/
         */
        // app.use("/colyseus", monitor());
    },
    beforeListen: () => {
        /**
         * Before before gameServer.listen() is called.
         */
    },
});
