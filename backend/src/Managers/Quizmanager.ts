import { AllowedSubmissions, Quiz } from "../Quiz";

let globalProblemId = 0;

export class QuizManager {
    private quizes: Quiz[];

    constructor() {
        this.quizes = [];
    }

    public start(roomId: string) {
        this.getQuiz(roomId)?.start();
    }

    public addProblem(
        roomId: string,
        problem: {
            title: string;
            description: string;
            image?: string;
            options: { id: number; title: string }[];
            answer: AllowedSubmissions;
        }
    ) {
        const quiz = this.getQuiz(roomId);
        if (!quiz) return;
        quiz.addProblem({
            ...problem,
            id: (globalProblemId++).toString(),
            startTime: new Date().getTime(),
            submissions: [],
        });
    }

    public next(roomId: string) {
        this.getQuiz(roomId)?.next();
    }

    public showLeaderboard(roomId: string) {
        this.getQuiz(roomId)?.sendLeaderboard();
    }

    public end(roomId: string) {
        this.getQuiz(roomId)?.end();
    }

    addUser(roomId: string, name: string) {
        return this.getQuiz(roomId)?.addUser(name) ?? null;
    }

    submit(
        userId: string,
        roomId: string,
        problemId: string,
        submission: AllowedSubmissions
    ) {
        this.getQuiz(roomId)?.submit(userId, roomId, problemId, submission);
    }

    getQuiz(roomId: string) {
        return this.quizes.find((x) => x.roomId === roomId) ?? null;
    }

    getCurrentState(roomId: string) {
        return this.getQuiz(roomId)?.getCurrentState() ?? null;
    }

    getProblemCount(roomId: string) {
        return this.getQuiz(roomId)?.getProblemCount() ?? 0;
    }

    addQuiz(roomId: string) {
        if (this.getQuiz(roomId)) return;
        this.quizes.push(new Quiz(roomId));
    }
}
