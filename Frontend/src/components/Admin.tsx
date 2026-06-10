import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { Socket } from "socket.io-client";
import { FaArrowLeft, FaCopy, FaCheck, FaPlus, FaLock } from "react-icons/fa";
import { createSocket } from "../lib/socket";
import type { LeaderboardEntry } from "../types";
import { CreateProblem } from "./CreateProblem";
import { QuizControls } from "./QuizControls";

type Phase = "auth" | "create_room" | "dashboard";

export function Admin() {
  const socketRef = useRef<Socket | null>(null);
  const [phase, setPhase] = useState<Phase>("auth");
  const [password, setPassword] = useState("ADMIN_PASSWORD");
  const [roomId, setRoomId] = useState("");
  const [problemCount, setProblemCount] = useState(0);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [error, setError] = useState("");
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = createSocket();
    socketRef.current = socket;
    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
    socket.on("adminInit", () => {
      setError("");
      setPhase("create_room");
    });
    socket.on("error_message", (d: { message: string }) => setError(d.message));
    socket.on("quizCreated", ({ roomId }: { roomId: string }) => {
      setRoomId(roomId);
      setPhase("dashboard");
    });
    socket.on("problemAdded", ({ count }: { count: number }) => setProblemCount(count));
    socket.on("leaderboard", ({ leaderboard }: { leaderboard: LeaderboardEntry[] }) =>
      setLeaderboard(leaderboard)
    );
    socket.on("ended", ({ leaderboard }: { leaderboard: LeaderboardEntry[] }) =>
      setLeaderboard(leaderboard)
    );
    return () => {
      socket.disconnect();
    };
  }, []);

  const authenticate = () => socketRef.current?.emit("joinAdmin", { password });
  const createRoom = () => {
    const id = roomId.trim().toUpperCase();
    if (!id) return;
    setRoomId(id);
    socketRef.current?.emit("createQuiz", { roomId: id });
  };

  return (
    <main className="min-h-full px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-white/50 hover:text-white">
          <FaArrowLeft /> Home
        </Link>

        <AnimatePresence mode="wait">
          {phase === "auth" && (
            <Gate
              key="auth"
              password={password}
              setPassword={setPassword}
              onSubmit={authenticate}
              disabled={!connected}
              error={error}
            />
          )}

          {phase === "create_room" && (
            <Gate
              key="room"
              title="Create a room"
              subtitle="Pick a room code players will use to join."
              icon={<FaPlus />}
              placeholder="ROOM CODE"
              cta="Create room"
              password={roomId}
              setPassword={(v) => setRoomId(v.toUpperCase())}
              onSubmit={createRoom}
              disabled={!connected}
              error={error}
            />
          )}

          {phase === "dashboard" && socketRef.current && (
            <motion.div
              key="dash"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 gap-6 lg:grid-cols-5"
            >
              <div className="lg:col-span-3">
                <CreateProblem socket={socketRef.current} roomId={roomId} />
              </div>
              <div className="lg:col-span-2 space-y-6">
                <RoomCard roomId={roomId} problemCount={problemCount} />
                <QuizControls
                  socket={socketRef.current}
                  roomId={roomId}
                  problemCount={problemCount}
                  leaderboard={leaderboard}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

function RoomCard({ roomId, problemCount }: { roomId: string; problemCount: number }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="glass rounded-3xl p-6 text-center shadow-card">
      <p className="text-sm text-white/50">Room code</p>
      <div className="mt-1 flex items-center justify-center gap-3">
        <span className="text-3xl font-black tracking-[0.2em]">{roomId}</span>
        <button onClick={copy} className="rounded-xl bg-white/10 p-2 hover:bg-white/20">
          {copied ? <FaCheck className="text-emerald-300" /> : <FaCopy />}
        </button>
      </div>
      <p className="mt-3 text-sm text-white/50">
        {problemCount} question{problemCount === 1 ? "" : "s"} added
      </p>
    </div>
  );
}

function Gate({
  title = "Host login",
  subtitle = "Enter the admin password to continue.",
  icon = <FaLock />,
  placeholder = "Admin password",
  cta = "Continue",
  password,
  setPassword,
  onSubmit,
  disabled,
  error,
}: {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  placeholder?: string;
  cta?: string;
  password: string;
  setPassword: (v: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  error?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20 }}
      className="glass mx-auto max-w-md rounded-3xl p-8 shadow-card"
    >
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-lg">
        {icon}
      </div>
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="mt-1 text-white/55">{subtitle}</p>
      <input
        className="input-field mt-6"
        placeholder={placeholder}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSubmit()}
      />
      {error && <p className="mt-3 text-sm text-rose-300">{error}</p>}
      <button className="btn-primary mt-5 w-full" onClick={onSubmit} disabled={disabled}>
        {cta}
      </button>
    </motion.div>
  );
}
