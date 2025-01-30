import { motion, useAnimation } from "framer-motion";
import { FC, useState } from "react";
import { HiMail } from "react-icons/hi";
import { GiHamburgerMenu } from "react-icons/gi";
import Link from "next/link";
import useMediaQuery from "@utils/useMediaQuery";
import Highlight from "@components/Highlight";
import { CONFIG } from "@root/libs/config";

const variants = {
  hover: { y: -5 },
  initial: { y: 0 },
};

const links = [
  { name: "home", href: "/", slash: "slash", open: true, newTab: false },
  { name: "projects", href: "/projects", slash: "slash", open: true, newTab: false },
  { name: "stack", href: "/stack", slash: "slash", open: true, newTab: false },
  {
    name: "lol",
    href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    slash: "slash",
    open: true,
    newTab: true,
  },
];

export const Header: FC = () => {
  const isBreakPoint = useMediaQuery(768);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Top Bar */}
      <div id="top" className="h-2 w-full bg-pastel-green"></div>

      {/* Header Container */}
      <motion.div
        className={`fixed md:static top-0 w-screen md:w-auto h-24 md:h-48 px-8 md:px-24 2xl:px-56
          flex flex-row lg:relative
          ${mobileMenuOpen ? "bg-epic-black-light" : "bg-epic-black"}
          z-50`} // Added z-50 to ensure the header is on top
      >
        {/* Logo / Brand Name */}
        <h1
          onClick={() => {
            window.location.href = "/";
          }}
          className="flex flex-row justify-center items-center text-white text-3xl mr-5"
        >
          <div className="hover:cursor-pointer">
            {CONFIG.NICKNAME}
          </div>
        </h1>

        {/* Navigation Links (Desktop) */}
        {!isBreakPoint &&
          links.map((link, key) => {
            if (!link.open) return null;
            return (
              <HeaderLink
                name={link.name}
                href={link.href}
                slash={link.slash}
                open={link.open}
                newTab={link.newTab}
                key={key}
              />
            );
          })}

        {/* Mobile Menu Button or Contact Button */}
        {isBreakPoint ? (
          <MobileNavButton
            func={setMobileMenuOpen}
            mobileMenuOpen={mobileMenuOpen}
          />
        ) : (
          <ContactButton />
        )}
      </motion.div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && isBreakPoint ? <MobileDropDown /> : null}
    </>
  );
};

interface HeaderLinkProps {
  name: string;
  href: string;
  slash: string;
  open: boolean;
  newTab: boolean;
}

const HeaderLink = ({ name, href, slash, newTab }: HeaderLinkProps) => {
  const controls = useAnimation();

  return (
    <div
      className={`invisible md:visible
        flex flex-row justify-center items-center 
        text-white
        mt-2.5 ml-10`}
    >
      <motion.div
        onMouseEnter={() => controls.start("hover")}
        onMouseLeave={() => controls.start("initial")}
        variants={variants}
        animate={controls}
      >
        <Ref
          name={name}
          href={href}
          slash={slash}
          newTab={newTab}
        ></Ref>
      </motion.div>
    </div>
  );
};

const buttonVariants = {
  default: { opacity: 0 },
  hover: { opacity: 1 },
};

const ContactButton = () => {
  const [buttonHovered, setButtonHovered] = useState(false);

  return (
    <>
      <button
        className="invisible md:visible
          flex flex-row justify-center items-center 
          text-white text-xl 
          ml-auto hover:cursor-pointer"
        onClick={() => {
          const email = "contact.xalonious@gmail.com";
          const subject = "Your Inquiry"; // You can customize the subject
          const body = "Hey xander!"; // You can customize the default email body
          window.location.href = `mailto:${email}?subject=${encodeURIComponent(
            subject
          )}&body=${encodeURIComponent(body)}`;
        }}
      >
        <motion.div
          whileHover={{
            y: -5,
          }}
          onHoverStart={() => setButtonHovered(true)}
          onHoverEnd={() => setButtonHovered(false)}
          className="w-10 h-10 lg:w-[136px]
            rounded-full lg:rounded-md 
            bg-pastel-green 
            hover:cursor-pointer"
        >
          <p className="mt-1.5 text-epic-black text-left">
            <HiMail className="float-left mt-[5.25px] ml-2.5" />
            <span className="float-left invisible lg:visible ml-2">
              contact
            </span>
          </p>
        </motion.div>
      </button>
      {!useMediaQuery(1023) ? (
        <p className="text-white text-[10px] absolute top-[120px] right-[106px] 2xl:right-[234px]">
          (contact.xalonious@gmail.com)
        </p>
      ) : null}
    </>
  );
};

interface RefProps {
  name: string;
  href: string;
  slash: string;
  newTab: boolean;
}

const Ref = ({ name, href, slash, newTab }: RefProps) => {
  if (newTab) {
    return (
      <a className="hover:cursor-pointer" href={href} target="_blank" rel="noopener noreferrer">
        {slash === "slash" && <Highlight>/</Highlight>}
        {slash === "hash" && <Highlight>#</Highlight>}
        {slash === "arrow" && <Highlight>&#8594;&nbsp;</Highlight>}
        {name}
      </a>
    );
  }
  return (
    <Link href={href}>
      <a>
        {slash === "slash" && <Highlight>/</Highlight>}
        {slash === "hash" && <Highlight>#</Highlight>}
        {slash === "arrow" && <Highlight>&#8594;&nbsp;</Highlight>}
        {name}
      </a>
    </Link>
  );
};

interface MobileNavButtonProps {
  func: (state: boolean) => void;
  mobileMenuOpen: boolean;
}

const MobileNavButton = ({ func, mobileMenuOpen }: MobileNavButtonProps) => {
  const [hiddenOverflow, setHiddenOverflow] = useState(false);

  return (
    <button
      className="visible md:invisible
        flex flex-row justify-center items-center
        text-white text-xl
        ml-auto hover:cursor-default"
      onClick={() => {
        if (!hiddenOverflow) {
          document.body.style.overflow = "hidden";
          setHiddenOverflow(true);
        } else {
          document.body.style.overflow = "auto";
          setHiddenOverflow(false);
        }
        window.location.href = "#top";
        func(!mobileMenuOpen);
      }}
    >
      <motion.div
        whileHover={{
          y: -5,
        }}
        className="w-10 lg:w-36 h-10
          rounded-full lg:rounded-md
          bg-pastel-green
          hover:cursor-pointer"
      >
        <p className="mt-1.5 text-epic-black">
          <GiHamburgerMenu className="float-left mt-[5.25px] ml-2.5" />
          <span className="invisible lg:visible">contact</span>
        </p>
      </motion.div>
    </button>
  );
};

const MobileDropDown = () => {
  return (
    <motion.div
      className="fixed top-20 w-screen px-10
        flex flex-col overflow-y-scroll
        bg-epic-black-light shadow-epic-black-light shadow-xl
        z-40" // Ensure dropdown is below the header's z-50
    >
      {links.map((link, key) => {
        if (!link.open) return null;
        return (
          <div
            className="hover:cursor-pointer hover:bg-epic-black-light
              text-center py-2.5 rounded-md"
            onClick={() => {
              window.location.href = link.href;
            }}
            key={key}
          >
            <p className="text-white text-xl">
              {link.slash === "slash" && <Highlight>/</Highlight>}
              {link.slash === "hash" && <Highlight>#</Highlight>}
              {link.slash === "arrow" && <Highlight>→ </Highlight>}
              {link.name}
            </p>
          </div>
        );
      })}
      <motion.div
        className="hover:cursor-pointer bg-pastel-green
          text-center text-xl py-2.5 rounded-md
          mt-2.5 flex justify-center items-center"
        whileHover={{
          y: -5,
        }}
        onClick={() => {
          const email = "contact.xalonious@gmail.com";
          const subject = "Your Inquiry"; // You can customize the subject
          const body = "Hey xander!"; // You can customize the default email body
          window.location.href = `mailto:${email}?subject=${encodeURIComponent(
            subject
          )}&body=${encodeURIComponent(body)}`;
        }}
      >
        <p className="text-epic-black text-base sm:text-lg">
          contact.xalonious@gmail.com
        </p>
      </motion.div>
    </motion.div>
  );
};

export default Header;
