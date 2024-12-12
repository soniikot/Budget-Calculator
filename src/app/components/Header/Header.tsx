import Link from "next/link";
import { FC } from "react";

const Header: FC = () => {
  return (
    <div className="mx-auto max-w-[320px] sm:max-w-[640px] md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1240px]">
      <header>
        <div className="flex justify-between my-10">
          <h3 className="text-2xl font-bold">Sofia Kotova</h3>
          <div className="flex gap-10">
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/projects">Projects</Link>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
