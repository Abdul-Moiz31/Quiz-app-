import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaBolt,
  FaUsers,
  FaTrophy,
  FaArrowRight,
  FaLock,
  FaMobileAlt,
  FaRocket,
  FaChartLine,
  FaGithub,
  FaRegLightbulb,
  FaGraduationCap,
  FaBuilding,
  FaGlassCheers,
  FaPlay,
  FaListOl,
  FaForward,
} from "react-icons/fa";
import { Navbar } from "./landing/Navbar";
import { MockQuizCard } from "./landing/MockQuizCard";
import { Counter } from "./landing/Counter";
import { Faq } from "./landing/Faq";

const reveal = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 90, damping: 16 } },
};

function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.section
      id={id}
      variants={reveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className={`mx-auto max-w-6xl px-6 ${className}`}
    >
      {children}
    </motion.section>
  );
}

export function Landing() {
  return (
    <div id="top" className="relative">
      <Navbar />

      {/* ===== Hero ===== */}
      <header className="relative overflow-hidden pt-32 pb-20">
        <div className="bg-grid pointer-events-none absolute inset-0 -z-10" />
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-2">
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.div variants={reveal} className="chip mb-6">
              <FaBolt className="text-amber-300" /> Live quizzes in real time · no app needed
            </motion.div>
            <motion.h1
              variants={reveal}
              className="text-5xl font-black leading-[1.05] sm:text-6xl lg:text-7xl"
            >
              Turn any room <br />
              into a <span className="gradient-text">live quiz</span> arena
            </motion.h1>
            <motion.p variants={reveal} className="mt-6 max-w-lg text-lg text-white/60">
              Host interactive quizzes, fire questions to every screen at once, and watch the
              leaderboard explode in real time. Built for classrooms, teams, and events.
            </motion.p>
            <motion.div variants={reveal} className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link to="/admin" className="btn-primary">
                <FaRocket /> Host a quiz <FaArrowRight className="text-sm" />
              </Link>
              <Link to="/user" className="btn-ghost">
                <FaUsers /> Join with a code
              </Link>
            </motion.div>
            <motion.div variants={reveal} className="mt-8 flex items-center gap-6 text-sm text-white/45">
              <span className="flex items-center gap-2">
                <FaLock className="text-emerald-400" /> Answers stay hidden
              </span>
              <span className="flex items-center gap-2">
                <FaMobileAlt className="text-brand-400" /> Any device
              </span>
            </motion.div>
          </motion.div>

          <div className="flex justify-center lg:justify-end">
            <MockQuizCard />
          </div>
        </div>
      </header>

      {/* ===== Stats bar ===== */}
      <Section className="pb-8">
        <div className="glass grid grid-cols-2 gap-6 rounded-3xl p-8 text-center shadow-card md:grid-cols-4">
          {[
            { value: 12, suffix: "K+", label: "Questions played" },
            { value: 98, suffix: "%", label: "Stay till the end" },
            { value: 250, suffix: "+", label: "Players per room" },
            { value: 1, suffix: "-click", label: "Deploy" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-black gradient-text sm:text-4xl">
                <Counter to={s.value} suffix={s.suffix} />
              </div>
              <p className="mt-1 text-sm text-white/50">{s.label}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ===== Features (bento) ===== */}
      <Section id="features" className="py-20">
        <div className="mb-12 text-center">
          <span className="section-eyebrow">Features</span>
          <h2 className="mt-4 text-4xl font-black sm:text-5xl">Everything you need to run the show</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/55">
            A polished host dashboard, instant player join, and motion-rich screens that keep the
            energy high.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* big tile */}
          <div className="glass group relative col-span-1 overflow-hidden rounded-3xl p-7 shadow-card md:col-span-2 md:row-span-2">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-violet-600/30 blur-3xl transition group-hover:bg-fuchsia-500/30" />
            <FaChartLine className="mb-4 text-3xl text-brand-400" />
            <h3 className="text-2xl font-bold">Real-time leaderboard</h3>
            <p className="mt-2 max-w-md text-white/55">
              Scores update the instant answers land. An animated podium crowns the top three after
              every round to keep the competition fierce.
            </p>
            <div className="mt-6 space-y-2">
              {[
                { n: "Maya", p: 980, w: "w-full" },
                { n: "Leo", p: 870, w: "w-5/6" },
                { n: "Aria", p: 640, w: "w-3/5" },
              ].map((r, i) => (
                <div key={r.n} className="flex items-center gap-3">
                  <span className="w-5 text-sm text-white/40">{i + 1}</span>
                  <div className="h-9 flex-1 overflow-hidden rounded-xl bg-white/5">
                    <div
                      className={`flex h-full ${r.w} items-center justify-between rounded-xl bg-gradient-to-r from-violet-500/40 to-fuchsia-500/40 px-3 text-sm`}
                    >
                      <span>{r.n}</span>
                      <span className="font-bold">{r.p}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {[
            { icon: FaBolt, title: "Speed scoring", desc: "Faster correct answers earn bigger bonuses." },
            { icon: FaLock, title: "Cheat-proof", desc: "Correct answers never reach the player's device." },
            { icon: FaMobileAlt, title: "Zero install", desc: "Join from any browser with a room code." },
            { icon: FaRocket, title: "One-click deploy", desc: "Docker, Render or Railway — ship in minutes." },
          ].map((f) => (
            <div key={f.title} className="glass rounded-3xl p-6 shadow-card transition hover:bg-white/[0.07]">
              <f.icon className="mb-3 text-2xl text-brand-400" />
              <h3 className="font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-white/55">{f.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ===== How it works ===== */}
      <Section id="how" className="py-20">
        <div className="mb-12 text-center">
          <span className="section-eyebrow">How it works</span>
          <h2 className="mt-4 text-4xl font-black sm:text-5xl">Live in three steps</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            { n: "01", icon: FaRegLightbulb, title: "Create & add questions", desc: "Spin up a room, write MCQs, and mark the correct answer in the host dashboard." },
            { n: "02", icon: FaUsers, title: "Players join", desc: "Share the room code. Everyone hops in from their own device — no signup." },
            { n: "03", icon: FaTrophy, title: "Play & climb", desc: "Fire questions, reveal results, and crown a champion on the live leaderboard." },
          ].map((s) => (
            <div key={s.n} className="glass relative rounded-3xl p-7 shadow-card">
              <span className="absolute right-6 top-5 text-5xl font-black text-white/5">{s.n}</span>
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-lg shadow-glow">
                <s.icon />
              </div>
              <h3 className="text-lg font-bold">{s.title}</h3>
              <p className="mt-2 text-sm text-white/55">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* host controls preview */}
        <div className="glass mt-8 flex flex-wrap items-center justify-center gap-3 rounded-3xl p-6">
          <span className="mr-2 text-sm text-white/50">Host controls:</span>
          {[
            { icon: FaPlay, label: "Start" },
            { icon: FaForward, label: "Next" },
            { icon: FaListOl, label: "Leaderboard" },
          ].map((c) => (
            <span key={c.label} className="chip">
              <c.icon className="text-brand-300" /> {c.label}
            </span>
          ))}
        </div>
      </Section>

      {/* ===== Use cases ===== */}
      <Section id="use-cases" className="py-20">
        <div className="mb-12 text-center">
          <span className="section-eyebrow">Use cases</span>
          <h2 className="mt-4 text-4xl font-black sm:text-5xl">Made for every kind of crowd</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            { icon: FaGraduationCap, title: "Classrooms", desc: "Turn revision into a game and see who's really paying attention.", grad: "from-sky-500/20 to-blue-600/10" },
            { icon: FaBuilding, title: "Team building", desc: "Break the ice in standups, onboarding, and all-hands meetings.", grad: "from-violet-500/20 to-fuchsia-600/10" },
            { icon: FaGlassCheers, title: "Events & pub nights", desc: "Run a high-energy trivia night with a big-screen leaderboard.", grad: "from-amber-400/20 to-orange-500/10" },
          ].map((u) => (
            <div key={u.title} className={`glass rounded-3xl bg-gradient-to-br ${u.grad} p-7 shadow-card`}>
              <u.icon className="mb-4 text-3xl text-white" />
              <h3 className="text-xl font-bold">{u.title}</h3>
              <p className="mt-2 text-white/60">{u.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ===== Testimonials ===== */}
      <Section className="py-20">
        <div className="mb-12 text-center">
          <span className="section-eyebrow">Loved by hosts</span>
          <h2 className="mt-4 text-4xl font-black sm:text-5xl">The room goes wild</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            { q: "My students beg to play this every Friday. The speed scoring makes them race to answer.", n: "Sara K.", r: "High-school teacher" },
            { q: "Set it up for our offsite in literally five minutes. The live podium was the highlight.", n: "Daniel R.", r: "Engineering lead" },
            { q: "Clean, fast, and it just works on everyone's phone. Our pub quiz nights leveled up.", n: "Priya M.", r: "Event host" },
          ].map((t) => (
            <div key={t.n} className="glass rounded-3xl p-7 shadow-card">
              <div className="mb-3 text-amber-300">★★★★★</div>
              <p className="text-white/75">“{t.q}”</p>
              <div className="mt-5 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 font-bold">
                  {t.n[0]}
                </span>
                <div>
                  <p className="text-sm font-semibold">{t.n}</p>
                  <p className="text-xs text-white/45">{t.r}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ===== FAQ ===== */}
      <Section id="faq" className="py-20">
        <div className="mb-12 text-center">
          <span className="section-eyebrow">FAQ</span>
          <h2 className="mt-4 text-4xl font-black sm:text-5xl">Questions, answered</h2>
        </div>
        <Faq />
      </Section>

      {/* ===== Final CTA ===== */}
      <Section className="py-20">
        <div className="glass relative overflow-hidden rounded-[2rem] p-12 text-center shadow-card">
          <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-violet-600/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-fuchsia-500/30 blur-3xl" />
          <FaBolt className="mx-auto mb-4 text-3xl text-amber-300" />
          <h2 className="text-4xl font-black sm:text-5xl">Ready to light up the room?</h2>
          <p className="mx-auto mt-3 max-w-md text-white/60">
            Create a room in seconds — no account, no setup, no cost.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/admin" className="btn-primary">
              <FaRocket /> Start hosting
            </Link>
            <Link to="/user" className="btn-ghost">
              <FaUsers /> Join a quiz
            </Link>
          </div>
        </div>
      </Section>

      {/* ===== Footer ===== */}
      <footer className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 sm:flex-row">
          <a href="#top" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500">
              <FaBolt className="text-sm" />
            </span>
            <span className="font-black">QuizPulse</span>
          </a>
          <div className="flex items-center gap-6 text-sm text-white/50">
            <a href="#features" className="hover:text-white">Features</a>
            <a href="#how" className="hover:text-white">How it works</a>
            <a href="#faq" className="hover:text-white">FAQ</a>
            <a
              href="https://github.com/Abdul-Moiz31/Quiz-app-"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 hover:text-white"
            >
              <FaGithub /> GitHub
            </a>
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-white/30">
          © {new Date().getFullYear()} QuizPulse · Open source & self-hostable.
        </p>
      </footer>
    </div>
  );
}
