import Hero from "@/components/Hero";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Me",
  description: "TheON2 커리어 소개",
};

const TITLE_CLASS = "text-2xl font-bold text-gray-800 my-2";
export default function AboutPage() {
  return (
    <>
      <Hero />
      <section className="bg-gray-100 shadow-lg p-8 m-8 text-center">
        <h2 className={TITLE_CLASS}>Who Am I?</h2>
        <p>
          꾸준히 학습하고 발전하는 것에 관심이 많은 주니어개발자 김도원 입니다.{" "}
          <br />
          NextJs 13과 TypeScript를 주력 기술로 활용하며, NodeJs 개발을 함께
          공부하여 다양한 관점을 고려합니다.
        </p>
        <h2 className={TITLE_CLASS}>Experience</h2>
        <p>
          항해99 15기 FE (2023.05.22 ~2023.09.15) <br />
          삼성 멀티캠퍼스 (2021.10.14 ~ 2022.03.04) <br />
          광주인력개발원 IOT (2020.02.24 ~ 2020.10.21)
        </p>
        <h2 className={TITLE_CLASS}>Skills</h2>
        <p>
          React, Vue, Node
          <br />
          Git, Clean Code <br />
          VS Code, IntelliJ, MongoDB
        </p>
      </section>
    </>
  );
}
