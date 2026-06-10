import { motion } from "framer-motion";

export function Card({
  sno,
  name,
  points,
  highlight,
}: {
  sno: number;
  name: string;
  points: number;
  highlight?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: (sno - 4) * 0.05 }}
      className={`flex items-center justify-between rounded-2xl px-4 py-3 ${
        highlight
          ? "border border-brand-400/50 bg-brand-500/15"
          : "border border-white/10 bg-white/5"
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="w-6 text-center text-sm font-bold text-white/50">{sno}</span>
        <div className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-sm font-semibold">
          {name?.[0]?.toUpperCase() ?? "?"}
        </div>
        <span className="font-medium">
          {name} {highlight && <span className="text-xs text-brand-300">(you)</span>}
        </span>
      </div>
      <span className="font-bold tabular-nums">{points}</span>
    </motion.div>
  );
}

export default Card;
