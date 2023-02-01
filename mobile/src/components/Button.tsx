import { Button as ButtonNativeBase, IButtonProps, Text } from "native-base";

interface Props extends IButtonProps {
  title: string;
  type?: "PRIMARY" | "SECONDARY";
}

export function Button({ title, type = "PRIMARY", ...rest }: Props) {
  return (
    <ButtonNativeBase
      w="full"
      h={14}
      rounded="sm"
      fontSize="md"
      bg={type === "PRIMARY" ? "yellow.500" : "red.500"}
      _pressed={{
        bg: type === "PRIMARY" ? "yellow.600" : "red.400",
      }}
      _loading={{
        _spinner: { color: "black" },
      }}
      {...rest}
    >
      <Text
        fontSize="sm"
        fontFamily="heading"
        textTransform="uppercase"
        color={type === "PRIMARY" ? "black" : "white"}
      >
        {title}
      </Text>
    </ButtonNativeBase>
  );
}
