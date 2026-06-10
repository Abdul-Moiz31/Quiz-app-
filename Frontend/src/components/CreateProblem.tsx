import { useState } from "react";
import { motion } from "framer-motion";
import type { Socket } from "socket.io-client";
import { FaPlus, FaCheckCircle } from "react-icons/fa";
import { OPTION_THEMES } from "../lib/options";

const emptyOptions = () => [0, 1, 2, 3].map((id) => ({ id, title: "" }));

export function CreateProblem({ socket, roomId }: { socket: Socket; roomId: string }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [answer, setAnswer] = useState(0);
  const [options, setOptions] = useState(emptyOptions());
  const [justAdded, setJustAdded] = useState(false);

  const canAdd =
    description.trim().length > 0 && options.every((o) => o.title.trim().length > 0);

  const addProblem = () => {
    if (!canAdd) return;
    socket.emit("createProblem", {
      roomId,
      problem: { title: title.trim(), description: description.trim(), options, answer },
    });
    setTitle("");
    setDescription("");
    setAnswer(0);
    setOptions(emptyOptions());
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  return (
    <div className="glass rounded-3xl p-6 shadow-card sm:p-8">
      <h2 className="text-xl font-bold">Add a question</h2>
      <p className="mt-1 text-sm text-white/50">
        Fill in the question and four options, then mark the correct one.
      </p>

      <div className="mt-6 space-y-4">
        <input
          className="input-field"
          placeholder="Topic / label (optional, e.g. Geography)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="input-field min-h-[90px] resize-none"
          placeholder="What is your question?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {options.map((opt, index) => {
            const theme = OPTION_THEMES[index];
            const isAnswer = answer === index;
            return (
              <div
                key={opt.id}
                className={`rounded-2xl bg-gradient-to-br ${theme.gradient} p-1 transition ${
                  isAnswer ? `ring-4 ${theme.ring}` : "opacity-90"
                }`}
              >
                <div className="flex items-center gap-2 rounded-xl bg-ink-800/80 px-3 py-2">
                  <button
                    type="button"
                    title="Mark as correct answer"
                    onClick={() => setAnswer(index)}
                    className={`shrink-0 text-lg ${isAnswer ? "text-emerald-300" : "text-white/30"}`}
                  >
                    <FaCheckCircle />
                  </button>
                  <input
                    className="w-full bg-transparent text-sm outline-none placeholder-white/40"
                    placeholder={`Option ${index + 1}`}
                    value={opt.title}
                    onChange={(e) =>
                      setOptions((prev) =>
                        prev.map((x) => (x.id === opt.id ? { ...x, title: e.target.value } : x))
                      )
                    }
                  />
                </div>
              </div>
            );
          })}
        </div>

        <button className="btn-primary w-full" onClick={addProblem} disabled={!canAdd}>
          {justAdded ? (
            <motion.span
              initial={{ scale: 0.6 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-2"
            >
              <FaCheckCircle /> Added!
            </motion.span>
          ) : (
            <>
              <FaPlus /> Add question
            </>
          )}
        </button>
      </div>
    </div>
  );
}
