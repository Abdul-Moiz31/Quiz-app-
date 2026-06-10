import { motion } from "framer-motion";
import { FaCrown, FaTrophy } from "react-icons/fa";
import type { LeaderboardEntry } from "../../types";
import { Card } from "./card";

export function LeaderBoard({
  leaderboardData,
  ended,
  youName,
}: {
  leaderboardData: LeaderboardEntry[];
  ended?: boolean;
  youName?: string;
}) {
  const top3 = leaderboardData.slice(0, 3);
  const rest = leaderboardData.slice(3);
  const podiumOrder = [1, 0, 2]; // left = 2nd, center = 1st, right = 3rd
  const heights = ["h-24", "h-32", "h-20"];
  const medals = ["text-slate-200", "text-amber-300", "text-orange-400"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      className="w-full max-w-2xl"
    >
      <div className="glass rounded-3xl p-6 shadow-card sm:p-8">
        <div className="mb-8 text-center">
          <FaTrophy className="mx-auto mb-2 text-3xl text-amber-300" />
          <h1 className="text-3xl font-black">
            {ended ? "Final Results" : "Leaderboard"}
          </h1>
          <p className="mt-1 text-white/55">
            {ended ? "Thanks for playing! 🎉" : "Standings so far"}
          </p>
        </div>

        {top3.length > 0 && (
          <div className="mb-8 flex items-end justify-center gap-3">
            {podiumOrder.map((rankIdx, i) => {
              const entry = top3[rankIdx];
              if (!entry) return null;
              return (
                <motion.div
                  key={entry.id ?? rankIdx}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 * i, type: "spring", stiffness: 120, damping: 14 }}
                  className="flex w-24 flex-col items-center"
                >
                  {rankIdx === 0 && <FaCrown className="mb-1 text-xl text-amber-300" />}
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-lg font-bold">
                    {entry.name?.[0]?.toUpperCase() ?? "?"}
                  </div>
                  <p className="mt-2 max-w-full truncate text-sm font-semibold">{entry.name}</p>
                  <p className="text-xs text-white/50">{entry.points} pts</p>
                  <div
                    className={`mt-2 w-full ${heights[rankIdx]} rounded-t-xl bg-white/10 ${medals[rankIdx]} grid place-items-end justify-center pb-1 text-2xl font-black`}
                  >
                    {rankIdx + 1}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        <div className="space-y-2">
          {rest.map((el, index) => (
            <Card
              key={el.id ?? index}
              sno={index + 4}
              name={el.name}
              points={el.points}
              highlight={!!youName && el.name === youName}
            />
          ))}
          {leaderboardData.length === 0 && (
            <p className="py-8 text-center text-white/40">No scores yet.</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
