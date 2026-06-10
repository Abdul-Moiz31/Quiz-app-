import { motion } from "framer-motion";

export function WaitingScreen({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="glass w-full max-w-md rounded-3xl p-10 text-center shadow-card"
    >
      <div className="mx-auto mb-6 flex justify-center gap-2">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-3 w-3 rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-400"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
      <h2 className="text-2xl font-bold">{title}</h2>
      {subtitle && <p className="mt-2 text-white/55">{subtitle}</p>}
    </motion.div>
  );
}
