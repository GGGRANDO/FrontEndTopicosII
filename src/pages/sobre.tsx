import React from "react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8 flex justify-center items-start">
      <section className="max-w-2xl bg-white shadow-md rounded-2xl p-8 text-center">
        <h1 className="mt-4 text-3xl font-bold">Gustavo Grando</h1>
        <p className="text-gray-600 mt-1">Desenvolvedor Full‑Stack & Mobile</p>
        <p className="mt-6 text-gray-700 leading-relaxed">
          Desenvolvedor de Software com mais de 3 anos de experiência, focado principalmente em backend. Possuo experiência em projeto profissionais com C#, Node.js, JavaScript e PHP, além de domínio em bancos de dados relacionais (SQL Server, MySQL, Oracle Database) e não relacionais (MongoDB)
        </p>
        <h2 className="mt-6 text-lg font-semibold">Habilidades principais</h2>
        <div className="mt-3 flex flex-wrap justify-center gap-2 text-sm">
          <span className="px-2 py-1 bg-gray-100 rounded-full">Desenvolvedor BackEnd</span>
          <span className="px-2 py-1 bg-gray-100 rounded-full">.Net</span>
          <span className="px-2 py-1 bg-gray-100 rounded-full">C#</span>
          <span className="px-2 py-1 bg-gray-100 rounded-full">Rabbitmq</span>
        </div>
        <a
          href="https://www.linkedin.com/in/gustavogrand0/"
          target="_blank"
          rel="noreferrer"
          className="inline-block mt-8 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          Ver LinkedIn
        </a>
      </section>
    </main>
  );
}
