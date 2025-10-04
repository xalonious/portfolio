"use client"

import { motion } from "framer-motion"
import Image from "next/image"

const technologies = [
  { name: "React", icon: "/tech/react.svg" },
  { name: "Next.js", icon: "/tech/nextjs.svg" },
  { name: "TypeScript", icon: "/tech/typescript.svg" },
  { name: "TailwindCSS", icon: "/tech/tailwindcss.svg" },
  { name: "Node.js", icon: "/tech/nodejs.svg" },
  { name: "Framer Motion", icon: "/tech/framer.svg" },
  { name: "Java", icon: "/tech/java.svg" },
  { name: "C#", icon: "/tech/csharp.svg" },
  { name: "JavaScript", icon: "/tech/javascript.svg" },
  { name: "Github", icon: "/tech/github.svg" },
  { name: "Linux", icon: "/tech/linux.svg" },
  { name: "Git", icon: "/tech/git.svg" },
  { name: "Python", icon: "/tech/python.svg" },
  { name: "CSS", icon: "/tech/css.svg" },
  { name: "HTML", icon: "/tech/html.svg" },
  { name: "Docker", icon: "/tech/docker.svg" },
  { name: "MongoDB", icon: "/tech/mongodb.svg" },
  { name: "Express", icon: "/tech/express.svg" },
  { name: "Bootstrap", icon: "/tech/bootstrap.svg" },
  { name: "MySQL", icon: "/tech/mysql.svg" },
  { name: ".NET", icon: "/tech/dotnet.svg" },
]

const looped = <T,>(arr: T[]) => [...arr, ...arr, ...arr]

export function TechCarousel() {
  return (
    <section className="relative isolate w-full overflow-hidden py-14">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0
        [-webkit-mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]
        [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-[--foreground]">My Tech Stack</h2>
          <p className="mt-2 text-sm text-muted-foreground">Tools I build with</p>
        </div>

        <motion.div
          className="flex min-w-max gap-6 pl-[max(6vw,2rem)] pr-[max(6vw,2rem)] whitespace-nowrap will-change-transform"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 22, ease: "linear", repeat: Infinity }}
        >
          {looped(technologies).map((t, i) => (
            <TechCard key={`r1-${i}`} {...t} />
          ))}
        </motion.div>

        <motion.div
          className="mt-6 flex min-w-max gap-6 pl-[max(6vw,2rem)] pr-[max(6vw,2rem)] whitespace-nowrap will-change-transform"
          animate={{ x: ["-50%", "0%"] }}
          transition={{ duration: 26, ease: "linear", repeat: Infinity }}
        >
          {looped(technologies).map((t, i) => (
            <TechCard key={`r2-${i}`} {...t} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function TechCard({ name, icon }: { name: string; icon: string }) {
  return (
    <div
      className="shrink-0 flex h-20 w-44 flex-col items-center justify-center gap-2 rounded-xl
                 border border-[--border]/50 bg-[--muted]
                 shadow-sm transition-all hover:-translate-y-[2px] hover:border-[--primary]/60 hover:shadow-md"
    >
      <Image
        src={icon}
        alt={name}
        width={32}
        height={32}
        className="h-8 w-8 object-contain opacity-90"
      />
      <span className="text-sm font-medium text-[--foreground]">{name}</span>
    </div>
  )
}
