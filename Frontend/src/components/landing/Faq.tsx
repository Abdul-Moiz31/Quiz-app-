import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus } from "react-icons/fa";

const FAQS = [
  {
    q: "Do players need to install anything?",
    a: "No. Players just open the link, enter the room code shown on screen and their name. It works on any phone or laptop browser.",
  },
  {
    q: "How does scoring work?",
    a: "Correct answers earn a base of 500 points plus a speed bonus of up to 500 — the faster you lock in the right answer, the more you score.",
  },
  {
    q: "How many people can join a room?",
    a: "Rooms are built for live sessions and comfortably handle a full classroom or team. The leaderboard shows the top 20 each round.",
  },
  {
    q: "Is it free and open source?",
    a: "Yes. QuizPulse is fully open source and self-hostable — deploy it to Render, Railway, Fly, or any Docker host in one command.",
  },
  {
    q: "Do I need a database?",
    a: "Nope. State lives in memory for the duration of a session, so there's zero setup. Perfect for live events; quizzes simply reset on restart.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {FAQS.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q} className="glass overflow-hidden rounded-2xl">
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
            >
              <span className="font-semibold">{f.q}</span>
              <motion.span animate={{ rotate: isOpen ? 45 : 0 }} className="text-brand-300">
                <FaPlus />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <p className="px-6 pb-5 text-white/60">{f.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
