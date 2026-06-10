import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaBolt, FaBars, FaTimes } from "react-icons/fa";

const links = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how" },
  { label: "Use cases", href: "#use-cases" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 90, damping: 16 }}
      className={`fixed inset-x-0 top-0 z-50 transition-all ${
        scrolled ? "border-b border-white/10 bg-ink-900/70 backdrop-blur-xl" : ""
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#top" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-glow">
            <FaBolt />
          </span>
          <span className="text-lg font-black tracking-tight">QuizPulse</span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-white/60 transition hover:text-white">
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link to="/user" className="text-sm font-semibold text-white/80 hover:text-white">
            Join
          </Link>
          <Link
            to="/admin"
            className="rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-2 text-sm font-semibold shadow-glow transition hover:brightness-110"
          >
            Host a quiz
          </Link>
        </div>

        <button className="md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menu">
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/10 bg-ink-900/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-2 py-3 text-white/70 hover:bg-white/5"
                >
                  {l.label}
                </a>
              ))}
              <div className="mt-2 flex gap-3">
                <Link to="/user" className="btn-ghost flex-1 py-3" onClick={() => setOpen(false)}>
                  Join
                </Link>
                <Link to="/admin" className="btn-primary flex-1 py-3" onClick={() => setOpen(false)}>
                  Host
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
