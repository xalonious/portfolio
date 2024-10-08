import { NextPage } from "next";

import { PageProps } from "@interfaces/PageProps";
import Header from "@components/Layout/Header";
import Footer from "@components/Layout/Footer";
import ProjectsComponent from "@components/Projects"; 

const Projects: NextPage<PageProps> = ({ lang }) => {
    return (
        <div className="relative">
            <Header />
            <ProjectsComponent /> 
            <Footer />
        </div>
    );
};

export default Projects;