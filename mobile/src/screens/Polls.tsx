import { useCallback, useState } from "react";
import { Divider, Icon, VStack, useToast, FlatList } from "native-base";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Octicons } from "@expo/vector-icons";

import { api } from "../services/api";

import { Button } from "../components/Button";
import { EmptyPollList } from "../components/EmptyPollList";
import { Header } from "../components/Header";
import { PollCard, PollCardProps } from "../components/PollCard";
import { Loading } from "../components/Loading";

export function Polls() {
  const [polls, setPolls] = useState<PollCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { navigate } = useNavigation();

  const toast = useToast();

  async function fetchPolls() {
    try {
      setIsLoading(true);

      const pollsResponse = await api.get("/polls");
      setPolls(pollsResponse.data.polls);
    } catch (error) {
      toast.show({
        title: "Não foi possível carregar os bolões.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchPolls();
    }, [])
  );

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Meus bolões" />

      <VStack mt={8} mx={5}>
        <Button
          title="Buscar bolão por código"
          leftIcon={
            <Icon as={Octicons} name="search" color="black" size="md" />
          }
          onPress={() => navigate("find")}
        />

        <Divider my={4} bgColor="gray.600" thickness={"1"} />
      </VStack>

      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={polls}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PollCard
              data={item}
              onPress={() => navigate("details", { id: item.id })}
            />
          )}
          ListEmptyComponent={<EmptyPollList />}
          px={5}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{ pb: 10 }}
        />
      )}
    </VStack>
  );
}
