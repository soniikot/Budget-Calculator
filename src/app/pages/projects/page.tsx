import Link from "next/link";
import Image from "next/image";
import { FC } from "react";

const projects = [
  {
    id: "1",
    title: "Food Delivery Project",
    shortDescription: "A modern food delivery application",
    image: "/eatly.png",
  },
  {
    id: "2",
    title: "Clothing Store",
    shortDescription: "E-commerce platform with modern UI/UX",
    image: "/clothing-store.png",
  },
];

const ProjectsPage: FC = () => {
  return (
    <main className="mx-auto max-w-[320px] sm:max-w-[640px] md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1240px]">
      <h1 className="text-4xl font-bold mb-6">My Projects</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Link
            href={`/projects/${project.id}`}
            key={project.id}
            className="group border rounded-lg overflow-hidden hover:shadow-lg hover:scale-105 transition-shadow"
          >
            <div className="relative w-full h-48">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover "
              />
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-2">{project.title}</h2>
              <p className="text-gray-600">{project.shortDescription}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
};

export default ProjectsPage;
