import { useSocket } from "@/socket/hook";
import { Button } from "antd";

export const Step0 = ({ goToNextStep }: any) => {
  const socket = useSocket();

  return (
    <Button
      onClick={() => {
        socket.emit("start_game");
        goToNextStep();
      }}
    >
      Start Game
    </Button>
  );
};
