import { STACK } from "@root/libs/config/stack";
import { motion } from "framer-motion";
import { FC } from "react";

export const Stack: FC = () => {
	return (
		<div className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 min-h-screen">
			<motion.div
				className="flex flex-col text-white px-4 md:px-16 pt-24 md:pt-0"
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8 }}
			>
				<h1 className="mx-auto text-2xl md:text-3xl font-bold text-center tracking-tight">
					Technologies I use &amp; support
				</h1>
				<p className="text-center mt-4">
					I highly leverage new bleeding-edge technologies and
					languages to stay on top of the game. You can find a list of
					my most-used technologies below. I use these technologies to
					build my own projects and to support my work.
				</p>
			</motion.div>

			<div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-16 px-4 md:px-16">
				{STACK.map((lang, key) => (
					<StackCard
						name={lang.name}
						logo={lang.logo}
						lang={lang}
						key={key}
					/>
				))}
			</div>

			<div className="w-full mb-12"></div> 
		</div>
	);
};

interface IStackCard {
	name: string;
	logo: string;
	lang: any;
}

const StackCard = ({ name, logo, lang }: IStackCard) => {
	return (
		<motion.div
			className={`bg-epic-black-light ${
				lang.hoverColor
			} flex flex-col rounded-md p-4 h-40 shadow-lg transform transition-transform duration-300 ${
				lang.name == "Github" ? "hover:cursor-pointer" : ""
			}`}
			whileHover={{ y: -5, scale: 1.05 }}
			onClick={() => {
				window.location.href = lang.href;
			}}
		>
			<img
				src={`./assets/langs/${logo}`}
				className="w-16 h-16 mx-auto mt-2 rounded-md"
			/>
			<p className="mx-auto mt-2 text-white">{name}</p>
		</motion.div>
	);
};

export default Stack;
