"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Dot = { left: string; top: string; duration: number; delay: number };

export function Story() {
  const [dots, setDots] = useState<Dot[]>([]);

  useEffect(() => {
    const generated: Dot[] = Array.from({ length: 30 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: 3 + Math.random() * 2,
      delay: Math.random() * 5,
    }));
    setDots(generated);
  }, []);

  return (
    <section id="about" className="relative py-20 sm:py-32 px-6 scroll-mt-24 overflow-hidden">
      <div className="absolute inset-0">
        {dots.map((dot, i) => (
          <motion.div
            key={i}
            className="absolute w-px h-px bg-cyan-400 rounded-full"
            style={{ left: dot.left, top: dot.top }}
            animate={{ y: [0, -100, 0], opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
            transition={{ duration: dot.duration, repeat: Infinity, delay: dot.delay }}
          />
        ))}
      </div>

      <div className="max-w-[1400px] mx-auto relative">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          className="mb-20 text-center"
        >
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
            className="h-px w-32 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto"
          />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start mb-32">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="space-y-10"
          >
            <div>
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "3rem" }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="h-1 bg-gradient-to-r from-cyan-400 to-purple-400 mb-8"
              />
              <h3 className="text-5xl font-black mb-8 leading-tight">
                <span className="text-white">The Story</span>
              </h3>
            </div>

            <div className="space-y-8 text-xl leading-relaxed text-gray-300">
              <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.6 }}>
                I'm a <span className="text-white font-semibold">self-taught, full-stack developer</span> who went
                headfirst into coding and fell in love with the first lines of code I've written.
              </motion.p>
              <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.7 }}>
                I like to <span className="text-white font-semibold">Code, Design, Innovate and Experiment</span>. With a
                background in <span className="text-cyan-400 font-semibold">Javascript, Typescript, and Java</span>, I
                build full-stack applications with scalable and responsive technologies.
              </motion.p>
              <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.8 }}>
                I'm also a fan of the <span className="text-white font-semibold">open-source community</span> and I'm
                always looking for new ways to improve my skills.
              </motion.p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.4 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-3 gap-6">
              {[
                { value: "1000+", label: "Coffee Consumed" },
                { value: "100+", label: "Rage Quits" },
                { value: "20+", label: "All-Nighters" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl font-black bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-600 uppercase tracking-widest">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-3xl group-hover:blur-2xl transition-all duration-700" />
              <div className="relative aspect-[4/3] rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl overflow-hidden">
                <div className="absolute inset-0 p-8 font-mono text-sm">
                  {[
                    { text: "// Self-taught developer", delay: 0 },
                    { text: "const passion = true;", delay: 0.2 },
                    { text: "while (passion) {", delay: 0.4 },
                    { text: "  learn();", delay: 0.6 },
                    { text: "  build();", delay: 0.8 },
                    { text: "  innovate();", delay: 1.0 },
                    { text: "}", delay: 1.2 },
                  ].map((line, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 1 + line.delay }}
                      className={i === 0 ? "text-gray-600 mb-4" : "text-cyan-400 mb-2"}
                    >
                      {line.text}
                      {i === 6 && (
                        <motion.span
                          animate={{ opacity: [1, 0, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="inline-block w-2 h-5 bg-cyan-400 ml-0.5 align-text-bottom"
                        />
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            <div className="flex flex-wrap gap-3">
              {["TypeScript", "React", "Next.js", "Node.js", "Java"].map((tech, i) => (
                <motion.div
                  key={tech}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.2 + i * 0.05, type: "spring" }}
                  className="px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl text-sm text-gray-400 hover:text-white hover:border-white/30 transition-all cursor-default"
                >
                  {tech}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="text-center max-w-3xl mx-auto"
        >
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.7 }}
            className="h-px w-24 bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto mb-8"
          />
          <p className="text-2xl sm:text-3xl font-light text-gray-500 italic">
            "Building the future, one line at a time"
          </p>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.9 }}
            className="h-px w-24 bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto mt-8"
          />
        </motion.div>
      </div>
    </section>
  );
}
