import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheck, FaTrophy, FaUsers } from "react-icons/fa";

const OPTIONS = [
  { label: "Pacific", color: "from-rose-500 to-red-600" },
  { label: "Atlantic", color: "from-sky-500 to-blue-600" },
  { label: "Indian", color: "from-amber-400 to-orange-500" },
  { label: "Arctic", color: "from-emerald-500 to-green-600" },
];
const CORRECT = 0;

const STANDINGS = [
  { name: "Maya", pts: 980 },
  { name: "Leo", pts: 870 },
  { name: "Aria", pts: 640 },
];

export function MockQuizCard() {
  // phases: 0 question, 1 picked, 2 reveal, 3 leaderboard
  const [phase, setPhase] = useState(0);
  const [timer, setTimer] = useState(12);

  useEffect(() => {
    const seq = [
      () => setPhase(1),
      () => setPhase(2),
      () => setPhase(3),
      () => {
        setPhase(0);
        setTimer(12);
      },
    ];
    let step = 0;
    const id = setInterval(() => {
      seq[step % seq.length]();
      step++;
    }, 1900);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (phase !== 0) return;
    const id = setInterval(() => setTimer((t) => (t > 0 ? t - 1 : 0)), 350);
    return () => clearInterval(id);
  }, [phase]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotate: -2 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ type: "spring", stiffness: 70, damping: 14, delay: 0.2 }}
      className="relative w-full max-w-sm"
    >
      {/* floating badges */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-6 -top-5 z-10 chip bg-ink-800/90 shadow-card"
      >
        <FaUsers className="text-brand-300" /> 248 playing
      </motion.div>
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-4 top-24 z-10 chip bg-ink-800/90 shadow-card"
      >
        <FaTrophy className="text-amber-300" /> Live
      </motion.div>

      <div className="glass rounded-3xl p-6 shadow-card">
        <AnimatePresence mode="wait">
          {phase < 3 ? (
            <motion.div
              key="q"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/60">
                  Geography
                </span>
                <span className="text-sm font-bold tabular-nums text-white/80">{timer}s</span>
              </div>
              <h3 className="text-xl font-bold leading-snug">
                Which is the largest ocean on Earth?
              </h3>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {OPTIONS.map((o, i) => {
                  const picked = phase >= 1 && i === CORRECT;
                  const dimmed = phase >= 2 && i !== CORRECT;
                  return (
                    <motion.div
                      key={o.label}
                      animate={{ scale: picked && phase >= 1 ? 1.04 : 1, opacity: dimmed ? 0.4 : 1 }}
                      className={`flex items-center gap-2 rounded-2xl bg-gradient-to-br ${o.color} p-3 text-sm font-semibold ${
                        picked && phase >= 1 ? "ring-4 ring-white/60" : ""
                      }`}
                    >
                      <span className="grid h-6 w-6 place-items-center rounded-lg bg-black/20 text-xs">
                        {phase >= 2 && i === CORRECT ? <FaCheck /> : String.fromCharCode(65 + i)}
                      </span>
                      {o.label}
                    </motion.div>
                  );
                })}
              </div>
              <p className="mt-4 h-5 text-center text-sm font-semibold text-emerald-300">
                {phase >= 2 ? "Correct! +980 points 🎉" : ""}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="lb"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="mb-4 text-center">
                <FaTrophy className="mx-auto mb-1 text-2xl text-amber-300" />
                <h3 className="text-lg font-black">Leaderboard</h3>
              </div>
              <div className="space-y-2">
                {STANDINGS.map((s, i) => (
                  <motion.div
                    key={s.name}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.12 }}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-4 text-sm font-bold text-white/50">{i + 1}</span>
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-sm font-bold">
                        {s.name[0]}
                      </span>
                      <span className="font-medium">{s.name}</span>
                    </div>
                    <span className="font-bold tabular-nums">{s.pts}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
