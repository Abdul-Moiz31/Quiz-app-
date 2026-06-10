import { Iomanager } from "./Managers/Iomanager";

export type AllowedSubmissions = 0 | 1 | 2 | 3;
export const PROBLEM_TIME_S = 20;

export interface User {
    name: string;
    id: string;
    points: number;
}

export interface Submission {
    problemId: string;
    userId: string;
    isCorrect: boolean;
    optionSelected: AllowedSubmissions;
}

export interface Option {
    id: number;
    title: string;
}

export interface Problem {
    id: string;
    title: string;
    description: string;
    image?: string;
    startTime: number;
    answer: AllowedSubmissions;
    options: Option[];
    submissions: Submission[];
}

export type QuizState =
    | { type: "not_started" }
    | { type: "question"; problem: PublicProblem }
    | { type: "leaderboard"; leaderboard: User[] }
    | { type: "ended"; leaderboard: User[] };

// Problem shape sent to clients — never leaks the correct `answer`.
export type PublicProblem = Omit<Problem, "answer" | "submissions">;

function toPublicProblem(problem: Problem): PublicProblem {
    const { answer, submissions, ...rest } = problem;
    return rest;
}

export class Quiz {
    public roomId: string;
    private problems: Problem[];
    private activeProblem: number;
    private users: User[];
    private currentState: "leaderboard" | "question" | "not_started" | "ended";

    constructor(roomId: string) {
        this.roomId = roomId;
        this.problems = [];
        this.activeProblem = 0;
        this.users = [];
        this.currentState = "not_started";
    }

    addProblem(problem: Problem) {
        this.problems.push(problem);
    }

    start() {
        if (this.problems.length === 0) return;
        this.activeProblem = 0;
        this.setActiveProblem(this.problems[0]);
    }

    private setActiveProblem(problem: Problem) {
        this.currentState = "question";
        problem.startTime = new Date().getTime();
        problem.submissions = [];
        Iomanager.getIo()
            .to(this.roomId)
            .emit("problem", { problem: toPublicProblem(problem) });
    }

    sendLeaderboard() {
        this.currentState = "leaderboard";
        Iomanager.getIo()
            .to(this.roomId)
            .emit("leaderboard", { leaderboard: this.getLeaderboard() });
    }

    next() {
        if (this.activeProblem + 1 >= this.problems.length) {
            this.end();
            return;
        }
        this.activeProblem++;
        this.setActiveProblem(this.problems[this.activeProblem]);
    }

    end() {
        this.currentState = "ended";
        Iomanager.getIo()
            .to(this.roomId)
            .emit("ended", { leaderboard: this.getLeaderboard() });
    }

    private genRandomString(length: number) {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let result = "";
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    addUser(name: string) {
        const id = this.genRandomString(7);
        this.users.push({ id, name, points: 0 });
        return id;
    }

    submit(
        userId: string,
        roomId: string,
        problemId: string,
        submission: AllowedSubmissions
    ) {
        const problem = this.problems.find((x) => x.id === problemId);
        const user = this.users.find((x) => x.id === userId);

        if (!problem || !user) return;

        const existingSubmission = problem.submissions.find(
            (x) => x.userId === userId
        );
        if (existingSubmission) return;

        const isCorrect = problem.answer === submission;
        problem.submissions.push({
            problemId,
            userId,
            isCorrect,
            optionSelected: submission,
        });

        if (isCorrect) {
            const elapsed = new Date().getTime() - problem.startTime;
            const speedBonus = Math.max(
                0,
                500 - (500 * elapsed) / (PROBLEM_TIME_S * 1000)
            );
            user.points += Math.round(500 + speedBonus);
        }
    }

    getLeaderboard() {
        return [...this.users]
            .sort((a, b) => b.points - a.points)
            .slice(0, 20)
            .map((u) => ({ ...u, points: Math.round(u.points) }));
    }

    getProblemCount() {
        return this.problems.length;
    }

    getCurrentState(): QuizState {
        if (this.currentState === "not_started") {
            return { type: "not_started" };
        }
        if (this.currentState === "ended") {
            return { type: "ended", leaderboard: this.getLeaderboard() };
        }
        if (this.currentState === "leaderboard") {
            return { type: "leaderboard", leaderboard: this.getLeaderboard() };
        }
        return {
            type: "question",
            problem: toPublicProblem(this.problems[this.activeProblem]),
        };
    }
}
