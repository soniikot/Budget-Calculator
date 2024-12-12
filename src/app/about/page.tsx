import { FC } from "react";

const AboutPage: FC = () => {
  return (
    <main className="mx-auto max-w-[320px] sm:max-w-[640px] md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1240px]">
      <h1 className="text-4xl font-bold mb-6">About Me</h1>
      <div className="mx-10 max-w-[580px]">
        <p className="flex min-h-screen  justify-center">
          Hello! <br></br> I'm Sofia Kotova, a Frontend Developer. My name is
          Sofia, and I'm a frontend developer! 👩‍💻 <br></br>I possess strong soft
          skills, diverse experience, and creative thinking, which helps me find
          unique solutions. <br></br>
          After changing careers, I've learned a lot about working with teams in
          stressful situations and know how to organize myself and others to
          achieve the best results without burnout. I have a solid foundation in
          HTML, CSS, JavaScript, and React. 💻
          <br></br>I always strive to write DRY code and make it readable and
          maintainable. I've developed adaptive websites, including a food
          delivery project and a clothing store, using React, Redux, and Strapi.
          I improved UX/UI and tested applications using Jest and React Testing
          Library, which reduced the number of bugs by 30%.
          <br></br>I believe that code becomes truly valuable when it solves
          real problems, so I try to connect my ideas with the real world as
          quickly as possible. 🌍 In my free time, I enjoy cooking for friends
          and traveling to learn something new. 🍽️✈️
          <br></br>
          Contacts:
          <br></br>
          Email: soniikot@gmail.com
          <br></br>
          Phone or WhatsApp: +15308443504
        </p>
      </div>
    </main>
  );
};

export default AboutPage;
