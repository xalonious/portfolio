import { FC } from "react";
import { HiOutlineHeart } from "react-icons/hi";
import { AiFillGithub, AiFillLinkedin } from "react-icons/ai";
import { motion } from "framer-motion";

export const Footer: FC = () => {
	return (
		<div className="bg-epic-black w-full h-24 mt-24 flex flex-row text-white relative">
			<div className="flex flex-row h-full w-full justify-center">
				<div className="mx-auto my-auto text-2xl flex flex-row">
					<motion.div
						onClick={() => {
							window.open("https://github.com/xalonious");
						}}
						whileHover={{ y: -5 }}
						className="transition-colors ease-in-out hover:text-pastel-green"
					>
						<AiFillGithub className="flex flex-row mr-6 hover:cursor-pointer" />
					</motion.div>
					<motion.div
						whileHover={{ y: -5 }}
						className="transition-colors ease-in-out text-pastel-pink"
					>
						<HiOutlineHeart className="flex flex-row hover:cursor-pointer" />
					</motion.div>
					<motion.div
						onClick={() => {
							// todo: add linkedin link
							// window.open("https://linkedin.com");
						}}
						whileHover={{ y: -5 }}
						className="transition-colors ease-in-out hover:text-pastel-green"
					>
						<AiFillLinkedin className="flex flex-row ml-6 hover:cursor-pointer" />
					</motion.div>
				</div>
			</div>
			<div className="absolute bottom-2 right-4 text-sm">
				Made with <HiOutlineHeart className="inline text-pastel-pink" /> by Xander
			</div>
		</div>
	);
};

export default Footer;
