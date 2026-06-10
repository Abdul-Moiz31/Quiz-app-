import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Socket } from "socket.io-client";
import { FaCheck, FaLock } from "react-icons/fa";
import type { PublicProblem } from "../types";
import { OPTION_THEMES } from "../lib/options";

const PROBLEM_TIME_S = 20;

export function Quiz({
  problem,
  socket,
  userId,
  roomId,
}: {
  problem: PublicProblem;
  socket: Socket;
  userId: string;
  roomId: string;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [remaining, setRemaining] = useState(PROBLEM_TIME_S);

  useEffect(() => {
    const tick = () => {
      const elapsed = (Date.now() - problem.startTime) / 1000;
      setRemaining(Math.max(0, Math.ceil(PROBLEM_TIME_S - elapsed)));
    };
    tick();
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [problem.startTime]);

  const submit = () => {
    if (selected === null || submitted) return;
    setSubmitted(true);
    socket.emit("submit", { userId, problemId: problem.id, submission: selected, roomId });
  };

  const pct = Math.max(0, (remaining / PROBLEM_TIME_S) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      className="w-full max-w-3xl"
    >
      <div className="glass rounded-3xl p-6 shadow-card sm:p-8">
        <div className="mb-5 flex items-center justify-between">
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/60">
            {problem.title || "Question"}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold tabular-nums">{remaining}s</span>
            <div className="h-2 w-24 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full bg-gradient-to-r from-violet-400 to-fuchsia-400"
                animate={{ width: `${pct}%` }}
                transition={{ ease: "linear", duration: 0.25 }}
              />
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold leading-snug sm:text-3xl">{problem.description}</h2>
        {problem.image && (
          <img src={problem.image} alt="" className="mt-4 max-h-56 rounded-2xl object-cover" />
        )}

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {problem.options.map((opt, index) => {
            const theme = OPTION_THEMES[index % OPTION_THEMES.length];
            const isSelected = selected === index;
            const Icon = theme.icon;
            return (
              <motion.button
                key={opt.id}
                disabled={submitted}
                onClick={() => setSelected(index)}
                whileHover={!submitted ? { scale: 1.02 } : {}}
                whileTap={!submitted ? { scale: 0.98 } : {}}
                className={`flex items-center gap-4 rounded-2xl bg-gradient-to-br ${theme.gradient} p-5 text-left font-semibold shadow-lg transition
                  ${isSelected ? `ring-4 ${theme.ring}` : "opacity-90"}
                  ${submitted && !isSelected ? "opacity-40" : ""}`}
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-black/20">
                  <Icon className="text-sm" />
                </span>
                <span className="flex-1">{opt.title || `Option ${index + 1}`}</span>
                {isSelected && <FaCheck />}
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="locked"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 flex items-center justify-center gap-2 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 py-4 font-semibold text-emerald-200"
            >
              <FaLock /> Answer locked in — waiting for results…
            </motion.div>
          ) : (
            <motion.button
              key="submit"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={submit}
              disabled={selected === null}
              className="btn-primary mt-6 w-full"
            >
              Lock in answer
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
