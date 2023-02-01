import { useEffect, useState } from "react";
import { FlatList, useToast } from "native-base";

import { api } from "../services/api";

import { Loading } from "./Loading";
import { Game, GameProps } from "./Game";
import { EmptyMyPollList } from "./EmptyMyPollList";

interface Props {
  pollId: string;
  code: string;
}

export function Guesses({ pollId, code }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [firstTeamPoints, setFirstTeamPoints] = useState("");
  const [secondTeamPoints, setSecondTeamPoints] = useState("");
  const [games, setGames] = useState<GameProps[]>([]);

  const toast = useToast();

  async function fetchGames() {
    try {
      setIsLoading(true);
      const gameResponse = await api.get(`/polls/${pollId}/games`);

      setGames(gameResponse.data.games);
    } catch (error) {
      console.log(error);

      toast.show({
        title: "Não foi possível carregar os jogos.",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGuessConfirm(gameId: string) {
    try {
      if (!firstTeamPoints.trim() || !secondTeamPoints.trim()) {
        return toast.show({
          title: "Insira o placar do bolão.",
          placement: "top",
          bgColor: "red.500",
        });
      }

      await api.post(`/polls/${pollId}/games/${gameId}/guesses`, {
        firstTeamPoints: Number(firstTeamPoints),
        secondTeamPoints: Number(secondTeamPoints),
      });

      toast.show({
        title: "Palpite realizado. Boa sorte!",
        placement: "top",
        bgColor: "green.500",
      });

      fetchGames();
    } catch (error) {
      console.log(error);

      let title: string;

      if (
        error.response?.data?.message ===
        "You are not allowed to make a guess in this game."
      ) {
        title = "Você não pode fazer um palpite neste jogo.";
      } else if (
        error.response?.data?.message ===
        "You already made a guess in this game."
      ) {
        title = "Você já fez um palpite neste jogo.";
      } else if (error.response?.data?.message === "Game expired.") {
        title = "Jogo expirado.";
      } else {
        title = "Algo deu errado. Tente novamente.";
      }

      toast.show({
        title,
        placement: "top",
        bgColor: "red.500",
      });
    }
  }

  useEffect(() => {
    fetchGames();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <FlatList
      data={games}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Game
          data={item}
          setFirstTeamPoints={setFirstTeamPoints}
          setSecondTeamPoints={setSecondTeamPoints}
          onGuessConfirm={() => handleGuessConfirm(item.id)}
        />
      )}
      _contentContainerStyle={{ pb: 10 }}
      ListEmptyComponent={() => <EmptyMyPollList code={code} />}
    />
  );
}
