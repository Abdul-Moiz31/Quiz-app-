import http from "http";
import { Server } from "socket.io";

export class Iomanager {
    private static io: Server;

    public static init(server: http.Server) {
        if (!this.io) {
            this.io = new Server(server, {
                cors: {
                    origin: process.env.CORS_ORIGIN || "*",
                    methods: ["GET", "POST"],
                },
            });
        }
        return this.io;
    }

    public static getIo() {
        if (!this.io) {
            throw new Error("Iomanager not initialized — call init(server) first.");
        }
        return this.io;
    }
}
