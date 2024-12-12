import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const projects = [
  {
    id: "1",
    title: "Food Delivery Project",
    description:
      "A React-based food delivery application using Redux and Strapi.",
    technologies: ["React", "Redux", "Strapi"],
    image: "/eatly.png",
    githubUrl: "https://github.com/soniikot/Eatly-Layout",
    liveUrl: "https://soniikot.github.io/Eatly-Layout/",
  },
  {
    id: "2",
    title: "Clothing Store",
    description: "An e-commerce platform for clothing with modern UI/UX.",
    technologies: ["React", "Redux", "Jest"],
    image: "/clothing-store.png",
    githubUrl: "https://github.com/soniikot/shopping-cart",
    liveUrl: "http://62.72.5.244:5173/",
  },
];

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProjectPage({ params }: Props) {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);

  if (!project) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-[320px] sm:max-w-[640px] md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1240px]">
      <div className="mx-10">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 mb-6 text-gray-600 hover:text-red-600 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Projects
        </Link>

        <div className="relative w-full h-[600px] mb-8 rounded-lg overflow-hidden">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        <h1 className="text-4xl font-bold mb-6">{project.title}</h1>
        <p className="mb-4 text-lg">{project.description}</p>

        <div className="flex gap-4 mb-8">
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Live Demo
          </a>
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
          >
            GitHub
          </a>
        </div>

        <div className="mt-4">
          <h2 className="text-2xl font-semibold mb-4">Technologies Used:</h2>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 bg-gray-900 rounded-full text-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
