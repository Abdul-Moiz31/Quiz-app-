import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { Socket } from "socket.io-client";
import { FaArrowLeft, FaBolt } from "react-icons/fa";
import { createSocket } from "../lib/socket";
import type { LeaderboardEntry, PublicProblem, QuizState } from "../types";
import { Quiz } from "./Quiz";
import { LeaderBoard } from "./leaderboard/Leaderboard";
import { WaitingScreen } from "./WaitingScreen";

export function User() {
  const [submitted, setSubmitted] = useState(false);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");

  if (!submitted) {
    return (
      <JoinScreen
        code={code}
        name={name}
        setCode={setCode}
        setName={setName}
        onJoin={() => setSubmitted(true)}
      />
    );
  }
  return <UserLoggedIn code={code.trim()} name={name.trim()} />;
}

function JoinScreen({
  code,
  name,
  setCode,
  setName,
  onJoin,
}: {
  code: string;
  name: string;
  setCode: (v: string) => void;
  setName: (v: string) => void;
  onJoin: () => void;
}) {
  const canJoin = code.trim().length > 0 && name.trim().length > 0;
  return (
    <main className="flex min-h-full items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 16 }}
        className="glass w-full max-w-md rounded-3xl p-8 shadow-card"
      >
        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-white/50 hover:text-white">
          <FaArrowLeft /> Home
        </Link>
        <h1 className="text-3xl font-bold">Join the quiz</h1>
        <p className="mt-2 text-white/55">Enter the room code shown on the screen.</p>

        <div className="mt-8 space-y-4">
          <input
            className="input-field text-center tracking-[0.3em]"
            placeholder="ROOM CODE"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
          />
          <input
            className="input-field"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && canJoin && onJoin()}
          />
          <button className="btn-primary w-full" disabled={!canJoin} onClick={onJoin}>
            <FaBolt /> Join now
          </button>
        </div>
      </motion.div>
    </main>
  );
}

function UserLoggedIn({ name, code }: { name: string; code: string }) {
  const socketRef = useRef<Socket | null>(null);
  const [state, setState] = useState<QuizState>({ type: "not_started" });
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = createSocket();
    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      setError("");
      socket.emit("join", { roomId: code, name });
    });
    socket.on("disconnect", () => setConnected(false));
    socket.on("error_message", (d: { message: string }) => setError(d.message));

    socket.on("init", ({ userId, state }: { userId: string; state: QuizState }) => {
      setUserId(userId);
      if (state) setState(state);
    });
    socket.on("problem", ({ problem }: { problem: PublicProblem }) =>
      setState({ type: "question", problem })
    );
    socket.on("leaderboard", ({ leaderboard }: { leaderboard: LeaderboardEntry[] }) =>
      setState({ type: "leaderboard", leaderboard })
    );
    socket.on("ended", ({ leaderboard }: { leaderboard: LeaderboardEntry[] }) =>
      setState({ type: "ended", leaderboard })
    );

    return () => {
      socket.disconnect();
    };
  }, [code, name]);

  if (error) {
    return (
      <CenterCard>
        <h2 className="text-2xl font-bold text-rose-300">Couldn’t join</h2>
        <p className="mt-2 text-white/60">{error}</p>
        <Link to="/user" className="btn-ghost mt-6" onClick={() => window.location.reload()}>
          Try again
        </Link>
      </CenterCard>
    );
  }

  return (
    <main className="flex min-h-full items-center justify-center px-6 py-10">
      <AnimatePresence mode="wait">
        {!connected && (
          <WaitingScreen key="connecting" title="Connecting…" subtitle="Hang tight" />
        )}
        {connected && state.type === "not_started" && (
          <WaitingScreen
            key="waiting"
            title="You're in!"
            subtitle={`Welcome, ${name}. Waiting for the host to start…`}
          />
        )}
        {connected && state.type === "question" && (
          <Quiz
            key={state.problem.id}
            problem={state.problem}
            userId={userId}
            roomId={code}
            socket={socketRef.current!}
          />
        )}
        {connected && (state.type === "leaderboard" || state.type === "ended") && (
          <LeaderBoard
            key={state.type}
            leaderboardData={state.leaderboard}
            ended={state.type === "ended"}
            youName={name}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

export function CenterCard({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-full items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass w-full max-w-md rounded-3xl p-8 text-center shadow-card"
      >
        {children}
      </motion.div>
    </main>
  );
}
