import { Socket } from "socket.io";
import { QuizManager } from "./Quizmanager";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "ADMIN_PASSWORD";

export class UserManager {
    private quizManager: QuizManager;

    constructor() {
        this.quizManager = new QuizManager();
    }

    addUser(socket: Socket) {
        this.createHandlers(socket);
    }

    private createHandlers(socket: Socket) {
        socket.on("join", (data) => {
            const roomId = String(data?.roomId || "").trim();
            const name = String(data?.name || "").trim();
            if (!roomId || !name) {
                socket.emit("error_message", { message: "Room code and name are required." });
                return;
            }
            const userId = this.quizManager.addUser(roomId, name);
            if (!userId) {
                socket.emit("error_message", { message: "That room doesn't exist yet." });
                return;
            }
            socket.join(roomId);
            socket.emit("init", {
                userId,
                state: this.quizManager.getCurrentState(roomId),
            });
        });

        socket.on("joinAdmin", (data) => {
            if (data?.password !== ADMIN_PASSWORD) {
                socket.emit("error_message", { message: "Invalid admin password." });
                return;
            }

            socket.emit("adminInit", { ok: true });

            socket.on("createQuiz", (d) => {
                const roomId = String(d?.roomId || "").trim();
                if (!roomId) return;
                this.quizManager.addQuiz(roomId);
                socket.join(roomId);
                socket.emit("quizCreated", { roomId });
            });

            socket.on("createProblem", (d) => {
                this.quizManager.addProblem(d.roomId, d.problem);
                socket.emit("problemAdded", {
                    roomId: d.roomId,
                    count: this.quizManager.getProblemCount(d.roomId),
                });
            });

            socket.on("start", (d) => {
                this.quizManager.start(d.roomId);
            });

            socket.on("next", (d) => {
                this.quizManager.next(d.roomId);
            });

            socket.on("showLeaderboard", (d) => {
                this.quizManager.showLeaderboard(d.roomId);
            });

            socket.on("end", (d) => {
                this.quizManager.end(d.roomId);
            });
        });

        socket.on("submit", (data) => {
            const submission = Number(data?.submission);
            if (![0, 1, 2, 3].includes(submission)) return;
            this.quizManager.submit(
                data.userId,
                data.roomId,
                data.problemId,
                submission as 0 | 1 | 2 | 3
            );
        });
    }
}
