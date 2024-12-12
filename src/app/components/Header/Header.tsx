"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathname = usePathname();

  return (
    <div className="mx-auto max-w-[320px] sm:max-w-[640px] md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1240px]">
      <header>
        <div className="flex justify-between my-10">
          <h3 className="text-2xl font-bold">Sofia Kotova</h3>
          <div className="flex gap-10">
            <Link
              href="/"
              className={
                pathname === "/"
                  ? "text-red-600 font-medium"
                  : "hover:text-red-600"
              }
            >
              Home
            </Link>
            <Link
              href="/about"
              className={
                pathname === "/about"
                  ? "text-red-600 font-medium"
                  : "hover:text-red-600"
              }
            >
              About
            </Link>
            <Link
              href="/projects"
              className={
                pathname === "/projects"
                  ? "text-red-600 font-medium"
                  : "hover:text-red-600"
              }
            >
              Projects
            </Link>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
