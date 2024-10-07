import { NextPage } from "next";
import Header from "@components/Layout/Header";
import Footer from "@components/Layout/Footer";

const Custom404: NextPage = () => {
    return (
        <div className="relative min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow flex flex-col items-center justify-center text-center bg-epic-black text-white">
                <h1 className="text-6xl font-bold mb-4">
                    404 - Page Not Found
                </h1>
                <p className="text-xl mb-8">
                    Sorry, the page you are looking for does not exist.
                </p>
                <a href="/" className="text-pastel-green underline hover:no-underline">
                    Go back to Home
                </a>
            </main>
            <Footer />
        </div>
    );
};

export default Custom404;