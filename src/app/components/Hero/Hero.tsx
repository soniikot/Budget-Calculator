import { FC } from "react";

const Hero: FC = () => {
  return (
    <div className="mx-auto max-w-[320px] sm:max-w-[640px] md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1240px]">
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-6xl font-bold">Sofia Kotova</h1>
        <p className="text-4xl">Frontend Developer</p>
      </div>
    </div>
  );
};

export default Hero;
