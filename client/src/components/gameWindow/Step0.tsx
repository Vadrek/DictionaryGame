import { Button } from "antd";

export const Step0 = ({ socket }: any) => {
  return (
    <Button
      onClick={() => {
        socket.emit("start_game");
      }}
    >
      Start Game
    </Button>
  );
};
