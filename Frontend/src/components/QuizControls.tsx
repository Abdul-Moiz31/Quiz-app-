import { motion } from "framer-motion";
import type { Socket } from "socket.io-client";
import { FaPlay, FaForward, FaListOl, FaStop } from "react-icons/fa";
import type { LeaderboardEntry } from "../types";

export function QuizControls({
  socket,
  roomId,
  problemCount,
  leaderboard,
}: {
  socket: Socket;
  roomId: string;
  problemCount: number;
  leaderboard: LeaderboardEntry[];
}) {
  const emit = (event: string) => socket.emit(event, { roomId });
  const disabled = problemCount === 0;

  const buttons = [
    { label: "Start quiz", icon: FaPlay, event: "start", primary: true },
    { label: "Next question", icon: FaForward, event: "next" },
    { label: "Show leaderboard", icon: FaListOl, event: "showLeaderboard" },
    { label: "End quiz", icon: FaStop, event: "end", danger: true },
  ];

  return (
    <div className="glass rounded-3xl p-6 shadow-card">
      <h2 className="text-lg font-bold">Controls</h2>
      {disabled && (
        <p className="mt-1 text-sm text-amber-300/80">Add a question to begin.</p>
      )}
      <div className="mt-4 grid grid-cols-2 gap-3">
        {buttons.map((b) => (
          <motion.button
            key={b.event}
            whileTap={{ scale: 0.96 }}
            disabled={disabled}
            onClick={() => emit(b.event)}
            className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${
              b.primary
                ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 shadow-glow"
                : b.danger
                ? "border border-rose-400/40 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20"
                : "border border-white/10 bg-white/5 hover:bg-white/10"
            }`}
          >
            <b.icon /> {b.label}
          </motion.button>
        ))}
      </div>

      {leaderboard.length > 0 && (
        <div className="mt-6">
          <p className="mb-2 text-sm font-semibold text-white/60">Live standings</p>
          <div className="space-y-1">
            {leaderboard.slice(0, 5).map((e, i) => (
              <div
                key={e.id ?? i}
                className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 text-sm"
              >
                <span className="text-white/70">
                  {i + 1}. {e.name}
                </span>
                <span className="font-bold tabular-nums">{e.points}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
