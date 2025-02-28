import { FC } from "react";
import { motion } from "framer-motion";

const projects = [
  {
    name: "Rexx",
    description:
      "Rexx is a multi-purpose Discord bot that I started working on back in 2020. It was my first major project. The development was discontinued when Discord announced the mandatory switch to slash commands, and I decided not to rewrite the entire codebase.",
    github: "https://github.com/xalonious/rexx",
    image: "rexx.png",
    languages: ["javascript", "nodejs"],
  },
  {
    name: "Krestia",
    description:
      "Krestia is a discord to roblox ranking bot that allows you to remotely manage your roblox group ranks. It provides a seamless integration between Discord and Roblox, making group management easier and more efficient.",
    github: "https://github.com/xalonious/Krestia",
    image: "krestia.png",
    languages: ["javascript", "nodejs"],
  },
  {
    name: "Teks cafe Helper",
    description:
      "Teks cafe helper is mainly a bot that revolves around economy, with some fun and silly commands as well. It offers a variety of features to enhance user engagement and interaction within the community.",
    github: "https://github.com/xalonious/teks-cafe-helper",
    image: "tekscafe.png",
    languages: ["javascript", "nodejs"],
  },
  {
    name: "My portfolio website",
    description:
      "The website you're currently on, built with Next.js and Tailwind CSS. It showcases my projects, skills, and experiences, providing a comprehensive overview of my work and capabilities.",
    github: "https://github.com/xalonious/portfolio",
    image: "portfolio.png",
    languages: ["typescript", "react", "nextjs", "tailwindcss"],
  },
  {
    name: "Barber App",
    description:
      "This was a school project, I created a simple barber app that allows users to book appointments with barbers. The site was built with React and Express, providing a seamless user experience and efficient booking process.",
    github: "https://github.com/xalonious/barber-app",
    image: "barber.png",
    languages: ["typescript", "react", "javascript", "nodejs", "bootstrap", "express"],
  },
  {
    name: "PassGuard",
    description:
      "PassGuard is a simple password manager built with Electron and SQLite. This tool allows you to securely store and manage your passwords, ensuring that your sensitive information is protected and easily accessible.",
    github: "https://github.com/xalonious/password-manager",
    "image": "passwordmanager.png",
    languages: ["javascript", "html", "css", "mysql"],
  },
  {
    name: "AutoClicker",
    description:
      "A simple autoclicker written in C# that allows you to automate mouse clicks. This tool is useful for repetitive tasks that require multiple clicks, saving you time and effort.",
    github: "https://github.com/xalonious/autoclicker",
    image: "autoclicker.png",
    languages: ["csharp", "dotnet"],
  },
  {
    name: "Web server file uploader",
    description:
      "A minimal file uploader web page that enables quick and secure file transfers. This project features a sleek, animated interface with progress tracking, designed for easy integration with devices like Raspberry Pi.",
    github: "https://github.com/xalonious/web-server-file-uploader",
    image: "uploader.png",
    languages: ["javascript", "nodejs", "express", "html", "css"],
  },
  {
    name: "Backup Code Encryptor",
    description:
      "A simple python program that allows you to encrypt your 2FA backup codes with a password. This tool ensures that your backup codes are securely stored and protected from unauthorized access.",
    github: "https://github.com/xalonious/backup-code-encryptor",
    image: "encryption.png",
    languages: ["python"],
  },
  {
    name: "Image Converter",
    description:
      "A simple image converter that allows you to convert images to different formats. This tool supports a wide range of image formats, making it easy to convert images for various purposes.",
    github: "https://github.com/xalonious/image_converter",
    image: "imageconverter.png",
    languages: ["python"],
  },
  {
    name: "Roblox in-game promote command",
    description:
      "A simple roblox in-game promote command that allows you to promote users in-game, with the backend being made in nodejs with express. This tool streamlines the promotion process, making it more efficient and user-friendly.",
    github: "https://github.com/xalonious/roblox-in-game-promote-command",
    image: "roblox.png",
    languages: ["javascript", "nodejs", "lua", "express"],
  },
];


const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const ProjectsComponent: FC = () => {
  return (
    <div className="w-full flex flex-col text-white px-6 md:px-16 pt-24 md:pt-0 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 min-h-screen">
      <motion.h1
        className="mx-auto text-4xl md:text-5xl font-extrabold text-center tracking-tight text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        My Projects
      </motion.h1>
      <motion.p
        className="text-center mt-4 text-lg md:text-xl max-w-2xl mx-auto text-gray-100"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Here are some of the projects I've worked on. Click on the links to view the code on GitHub.
      </motion.p>
      <motion.div
        className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-12 px-4 md:px-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {projects.map((project, key) => (
          <motion.div
            key={key}
            className="bg-gray-900 rounded-lg p-6 h-auto flex flex-col shadow-lg transform transition-transform duration-300 hover:scale-105"
            variants={itemVariants}
            whileHover={{ y: -5 }}
          >
            <img
              src={`./assets/projects/${project.image}`}
              className="w-full h-40 object-cover rounded-lg"
              alt={project.name}
            />
            <h2 className="mt-4 text-2xl font-bold text-white">
              {project.name}
            </h2>
            <p className="mt-2 text-sm text-gray-400 flex-grow">
              {project.description}
            </p>
            <div className="flex flex-row mt-4 space-x-3">
              {project.languages.map((lang, index) => (
                <div
                  className="group relative flex flex-col items-center"
                  key={index}
                >
                  <img
                    src={`./assets/langs/${lang}.svg`}
                    className="w-8 h-8"
                    alt={lang}
                  />
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 pointer-events-none z-10">
                    <div className="relative">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold rounded-lg px-3 py-1 shadow-xl">
                        {lang.toUpperCase()}
                      </div>
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <svg width="12" height="12" viewBox="0 0 12 12">
                          <defs>
                            <linearGradient
                              id={`gradient-${lang}`}
                              x1="0%"
                              y1="0%"
                              x2="100%"
                              y2="0%"
                            >
                              <stop offset="0%" stopColor="#8B5CF6" />
                              <stop offset="100%" stopColor="#EC4899" />
                            </linearGradient>
                          </defs>
                          <polygon
                            fill={`url(#gradient-${lang})`}
                            points="0,0 12,0 6,6"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <a
              href={project.github}
              className="mt-8 text-pastel-green font-semibold underline hover:no-underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              View on GitHub
            </a>
          </motion.div>
        ))}
        <motion.div
          className="bg-gray-900 rounded-lg p-6 h-auto flex flex-col shadow-lg transform transition-transform duration-300 hover:scale-105"
          variants={itemVariants}
          whileHover={{ y: -5 }}
        >
          <h2 className="mt-4 text-xl font-bold text-center text-white">
            More coming soon!
          </h2>
        </motion.div>
      </motion.div>
      <div className="w-full mb-16"></div>
    </div>
  );
};

export default ProjectsComponent;
