import { Center, Icon, Text } from "native-base";
import { Fontisto } from "@expo/vector-icons";
import { useAuth } from "../hooks/useAuth";

import Logo from "../assets/logo.svg";
import { Button } from "../components/Button";

export function SignIn() {
  const { signIn, isUserLoading } = useAuth();

  return (
    <Center flex={1} p={7} bgColor="gray.900">
      <Logo width={212} height={40} />

      <Button
        mt={12}
        title="Entrar com Google"
        leftIcon={<Icon as={Fontisto} name="google" color="white" size="md" />}
        type="SECONDARY"
        onPress={signIn}
        isLoading={isUserLoading}
        _loading={{
          _spinner: { color: "white" },
        }}
      />

      <Text mt={4} px={6} color="gray.200" textAlign="center">
        Não utilizamos nenhuma informação além do seu e-mail para criação de sua
        conta.
      </Text>
    </Center>
  );
}
