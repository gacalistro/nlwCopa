import { FormEvent, useState } from "react";
import { api } from "../lib/axios";
import Image from "next/image";

import logoImg from "../assets/logo.svg";
import usersAvatarExampleImg from "../assets/users-avatar-example.png";
import iconCheckImg from "../assets/icon-check.svg";
import appPreviewImg from "../assets/app-nlw-copa-preview.png";

interface HomeProps {
  pollsCount: number;
  usersCount: number;
  guessesCount: number;
}

export default function Home(props: HomeProps) {
  const [pollTitle, setPollTitle] = useState("");

  async function createPoll(event: FormEvent) {
    event.preventDefault();

    try {
      const response = await api.post("polls", { title: pollTitle });

      const { code } = response.data;

      await navigator.clipboard.writeText(code);

      alert(`Bolão criado!
      Código: ${code}
      Copiado para a àrea de transferência.`);

      setPollTitle("");
    } catch (error) {
      console.log(error);
      alert("Erro ao criar bolão, tente novamente.");
    }
  }

  return (
    <div className="max-w-6xl h-screen mx-auto grid grid-cols-2 items-center">
      <main>
        <Image src={logoImg} alt="NLW Copa Logo" />
        <h1 className="mt-16 text-white text-5xl font-bold leading-tight">
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>
        <div className="mt-10 flex items-center gap-2">
          <Image src={usersAvatarExampleImg} alt="Avatares de usuários" />
          <strong className="text-gray-200 text-xl">
            <span className="text-green-ignite">+{props.usersCount}</span>{" "}
            pessoas já estão usando
          </strong>
        </div>

        <form onSubmit={createPoll} className="mt-10 flex gap-2">
          <input
            className="flex-1 px-6 py-4 border border-gray-600 bg-gray-800 rounded text-sm text-gray-250"
            type="text"
            placeholder="Qual o nome do seu bolão?"
            required
            onChange={(event) => setPollTitle(event.target.value)}
            value={pollTitle}
          />
          <button
            className="px-6 py-4 bg-yellow-500 text-gray-900 text-sm font-bold uppercase rounded hover:bg-yellow-600 duration-300"
            type="submit"
          >
            Criar meu bolão
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-300 leading-relaxed">
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas 🚀
        </p>

        <div className="mt-10 pt-10 grid grid-cols-2 text-gray-200 border-t border-gray-600 divide-x divide-gray-600">
          <div className="flex items-center gap-6">
            <Image src={iconCheckImg} alt="Ícone verde positivo" />
            <div className="flex flex-col">
              <span className="text-2xl font-bold">+{props.pollsCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>

          <div className="justify-end flex items-center gap-6">
            <Image src={iconCheckImg} alt="Ícone verde positivo" />
            <div className="flex flex-col">
              <span className="text-2xl font-bold">+{props.guessesCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>

      <Image
        src={appPreviewImg}
        alt="Dois celulares exibindo uma prévia da aplicação móvel do NLW Copa."
        quality={100}
      />
    </div>
  );
}

export const getStaticProps = async () => {
  const [pollsCountResponse, usersCountResponse, guessesCountResponse] =
    await Promise.all([
      api.get("polls/count"),
      api.get("users/count"),
      api.get("guesses/count"),
    ]);

  return {
    props: {
      pollsCount: pollsCountResponse.data.count,
      usersCount: usersCountResponse.data.count,
      guessesCount: guessesCountResponse.data.count,
    },
    revalidate: 600,
  };
};
