import Highlight from "@components/Highlight";
import useMediaQuery from "@utils/useMediaQuery";
import { motion } from "framer-motion";
import { FC } from "react";

export const More: FC = () => {
    const isLargeScreen = useMediaQuery(1200);
    const isSmallScreen = useMediaQuery(767);

    return (
        <div className="w-full flex flex-col md:flex-row text-center md:text-right mt-8">
            <div className="relative flex flex-col w-1/5 lg:w-1/2 px-8 sm:px-20 md:px-24 md:pt-20 2xl:pl-56">
                {!isSmallScreen && (
                    <>
                        <motion.img
                            src={"./assets/cat.png"}
                            className={`object-cover h-48 w-80 rounded-lg my-auto mt-[-100px] relative`}
                            whileHover={{ scale: 1.25 }}
                        />
                        <img
                            src={"./assets/cute_af_cat.png"}
                            className={`w-20 h-20 rounded-lg absolute ${
                                isLargeScreen ? "left-[550px] top-[-50px]" : "left-[400px] top-[-30px]"
                            }`}
                            style={{ transform: "translateX(180%)" }}
                        />
                    </>
                )}
            </div>

            <div
                className="flex flex-col 
                w-full md:w-2/3 lg:w-3/5 custom-md:w-1/2
                px-8 sm:px-20 md:px-24 2xl:pr-56 pt-16
                text-white"
            >
                <h1 className="text-6xl tracking-[-5px] font-bold">
                    Not in front of my <Highlight>IDE</Highlight>?
                </h1>
                <p className="mt-4">
                    I go touch some <Highlight>grass</Highlight>, pet my
                    cat, or&nbsp;
                    <span className="hover:cursor-pointer text-pastel-green hover:no-underline">
                        play some games
                    </span>
                    .<br />
                </p>

                {isSmallScreen && (
                    <div className="flex flex-col items-center relative">
                        <img
                            src={"./assets/cat.png"}
                            className="w-72 h-auto mt-16 rounded-lg mx-auto shadow-lg shadow-pastel-black flex flex-row object-cover"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default More;