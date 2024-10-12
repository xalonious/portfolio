import { FC } from "react";
import { motion } from "framer-motion";

const projects = [
    {
        name: "Rexx",
        description: "Rexx is a multi-purpose Discord bot that I started working on back in 2020. It was my first major project. The development was discontinued when Discord announced the mandatory switch to slash commands, and I decided not to rewrite the entire codebase.",
        github: "https://github.com/xalonious/rexx",
        image: "rexx.png",
        languages: ["javascript", "nodejs"],
    },
    {
        name: "Krestia",
        description: "Krestia is a discord to roblox ranking bot that allows you to remotely manage your roblox group ranks. It provides a seamless integration between Discord and Roblox, making group management easier and more efficient.",
        github: "https://github.com/xalonious/Krestia",
        image: "krestia.png",
        languages: ["javascript", "nodejs"],
    },
    {
        name: "Teks cafe Helper",
        description: "Teks cafe helper is mainly a bot that revolves around economy, with some fun and silly commands as well. It offers a variety of features to enhance user engagement and interaction within the community.",
        github: "https://github.com/saadih/tekscafebot",
        image: "tekscafe.png",
        languages: ["javascript", "nodejs"],
    },
    {
        name: "My portfolio website", 
        description: "The website you're currently on, built with Next.js and Tailwind CSS. It showcases my projects, skills, and experiences, providing a comprehensive overview of my work and capabilities.",
        github: "https://github.com/xalonious/portfolio",
        image: "portfolio.png",
        languages: ["typescript", "react", "nextjs", "css"],
    },
    {
        name: "Backup Code Encryptor",
        description: "A simple python program that allows you to encrypt your 2FA backup codes with a password. This tool ensures that your backup codes are securely stored and protected from unauthorized access.",
        github: "https://github.com/xalonious/backup-code-encryptor",
        image: "encryption.png",
        languages: ["python"],
    },
    {
        name: "Roblox in-game promote command",
        description: "A simple roblox in-game promote command that allows you to promote users in-game, with the backend being made in nodejs with express. This tool streamlines the promotion process, making it more efficient and user-friendly.",
        github: "https://github.com/xalonious/roblox-in-game-promote-command",
        image: "roblox.png",
        languages: ["javascript", "nodejs", "lua"],
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
                        <h2 className="mt-4 text-2xl font-bold text-white">{project.name}</h2>
                        <p className="mt-2 text-sm text-gray-400 flex-grow">{project.description}</p>
                        <div className="flex flex-row mt-4 space-x-3">
                            {project.languages.map((lang, index) => (
                                <div className="group relative" key={index}>
                                    <img
                                        src={`./assets/langs/${lang}.svg`}
                                        className="w-8 h-8"
                                        alt={lang}
                                    />
                                </div>
                            ))}
                        </div>
                        <a
                            href={project.github}
                            className="mt-6 text-pastel-green font-semibold underline hover:no-underline"
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
                    <h2 className="mt-4 text-xl font-bold text-center text-white">More coming soon!</h2>
                </motion.div>
            </motion.div>
            <div className="w-full mb-16"></div> 
        </div>
    );
};

export default ProjectsComponent;
