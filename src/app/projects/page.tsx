import { FC } from "react";
import Image from "next/image";
import Link from "next/link";

interface Project {
  title: string;
  description: string;
  technologies: string[];
  imageUrl: string;
  projectUrl: string;
  githubUrl: string;
}

const projects: Project[] = [
  {
    title: "Food Delivery Project",
    description:
      "A responsive food delivery application built with React and Redux. Implemented user authentication, shopping cart functionality, and real-time order tracking.",
    technologies: ["React", "Redux", "Strapi", "Tailwind CSS"],
    imageUrl: "/projects/food-delivery.jpg",
    projectUrl: "https://food-delivery-project.com",
    githubUrl: "https://github.com/sofiakotova/food-delivery",
  },
  {
    title: "Clothing Store",
    description:
      "E-commerce platform featuring product catalog, shopping cart, and secure checkout. Improved UX/UI and implemented comprehensive testing.",
    technologies: ["React", "TypeScript", "Jest", "React Testing Library"],
    imageUrl: "/projects/clothing-store.jpg",
    projectUrl: "https://clothing-store-project.com",
    githubUrl: "https://github.com/sofiakotova/clothing-store",
  },
];

const ProjectsPage: FC = () => {
  return (
    <main className="flex min-h-screen items-center mx-auto max-w-[280px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px] xl:max-w-[700px]">
      <div>
        <h1 className="text-4xl font-bold mb-6">My Projects</h1>
        <div className="grid gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48 mb-4">
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              <h2 className="text-2xl font-semibold mb-2">{project.title}</h2>
              <p className="text-gray-600 mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex gap-4">
                <Link
                  href={project.projectUrl}
                  target="_blank"
                  className="text-blue-600 hover:underline"
                >
                  Live Demo
                </Link>
                <Link
                  href={project.githubUrl}
                  target="_blank"
                  className="text-gray-600 hover:underline"
                >
                  GitHub
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default ProjectsPage;
