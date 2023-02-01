import { useState } from "react";
import { Heading, VStack, useToast } from "native-base";
import { useNavigation } from "@react-navigation/native";

import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { api } from "../services/api";

export function Find() {
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState("");

  const toast = useToast();
  const { navigate } = useNavigation();

  async function handleJoinPoll() {
    try {
      setIsLoading(true);

      if (!code.trim()) {
        setIsLoading(false);

        return toast.show({
          title: "Insira o código do bolão",
          placement: "top",
          bgColor: "red.500",
        });
      }

      await api.post("/polls/join", { code });

      setIsLoading(false);

      toast.show({
        title: "Você entrou no Bolão!",
        placement: "top",
        bgColor: "green.500",
      });

      navigate("polls");
    } catch (error) {
      console.log(error);

      setIsLoading(false);
      setCode("");

      let title: string;

      if (error.response?.data?.message === "Poll not found.") {
        title = "Bolão não encontrado.";
      } else if (
        error.response?.data?.message === "You have already joined this poll."
      ) {
        title = "Você já está neste bolão.";
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

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Buscar por código" showBackButton />

      <VStack mt={8} mx={5} alignItems="center">
        <Heading
          fontFamily="heading"
          fontSize="xl"
          color="white"
          mb={8}
          textAlign="center"
        >
          Encontre um bolão através de seu código único
        </Heading>

        <Input
          mb={2}
          placeholder="Qual o código do bolão?"
          autoCapitalize="words"
          value={code}
          onChangeText={(e) => setCode(e.toUpperCase())}
        />

        <Button
          title="Buscar bolão"
          onPress={handleJoinPoll}
          isLoading={isLoading}
        />
      </VStack>
    </VStack>
  );
}
