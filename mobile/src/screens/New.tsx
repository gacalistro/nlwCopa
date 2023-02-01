import { useState } from "react";
import { Heading, Text, VStack, useToast } from "native-base";
import { api } from "../services/api";

import Logo from "../assets/logo.svg";

import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";

export function New() {
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const toast = useToast();

  async function handlePollCreate() {
    if (!title.trim()) {
      return toast.show({
        title: "Insira o nome do bolão",
        placement: "top",
        bgColor: "red.500",
      });
    }

    try {
      setIsLoading(true);

      await api.post("/polls", {
        title,
      });

      toast.show({
        title: "Bolão criado!",
        placement: "top",
        bgColor: "green.500",
      });

      setTitle("");
    } catch (err) {
      console.log(err);

      toast.show({
        title: "Erro ao criar bolão",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Criar novo bolão" />

      <VStack mt={8} mx={5} alignItems="center">
        <Logo />

        <Heading
          fontFamily="heading"
          fontSize="xl"
          color="white"
          my={8}
          textAlign="center"
        >
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </Heading>

        <Input
          mb={2}
          placeholder="Qual o nome do seu bolão?"
          value={title}
          onChangeText={setTitle}
        />

        <Button
          title="Criar meu bolão"
          onPress={handlePollCreate}
          isLoading={isLoading}
        />

        <Text color="gray.200" textAlign="center" mt={4} px={8}>
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas.
        </Text>
      </VStack>
    </VStack>
  );
}
