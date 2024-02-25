import { useRef, useEffect, useState } from "react";
import gameService from "../../services/gameService";
import { Player, Square } from "../../services/gameService/type";
import socketService from "../../services/socketService";
import { roundTwo } from "../../utils";
import "./canvas.css";
import { colorSquare, writeText } from "./helpers";

const PIXEL_BY_SQUARE = 10;

export function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keystate: Record<string, boolean> = {};

  const maxWidth = useRef(0);
  const maxHeight = useRef(0);
  const ratioX = useRef(0);
  const ratioY = useRef(0);
  const nbRows = useRef(0);
  const nbCols = useRef(0);

  const [board, setBoard] = useState([] as Square[][]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const move = () => {
    if (socketService.socket) {
      if (keystate.ArrowUp) {
        gameService.movePlayer(socketService.socket, {
          direction: "UP",
        });
      }
      if (keystate.ArrowDown)
        gameService.movePlayer(socketService.socket, {
          direction: "DOWN",
        });
      if (keystate.ArrowLeft)
        gameService.movePlayer(socketService.socket, {
          direction: "LEFT",
        });
      if (keystate.ArrowRight) {
        gameService.movePlayer(socketService.socket, {
          direction: "RIGHT",
        });
      }
    }
  };

  const connectSocket = async () => {
    const server_url = process.env.REACT_APP_API_URL || "http://localhost:9000";
    await socketService.connect(server_url).catch((err) => {
      console.log("Error: ", err);
    });
  };

  useEffect(() => {
    if (!socketService.socket) {
      connectSocket();
    }
    if (canvasRef.current) {
      maxWidth.current = canvasRef.current.offsetWidth;
      maxHeight.current = canvasRef.current.offsetHeight;
      canvasRef.current.width = canvasRef.current.offsetWidth;
      canvasRef.current.height = canvasRef.current.offsetHeight;

      if (socketService.socket) {
        gameService.onInitBoard(socketService.socket, (board) => {
          setBoard(board);
          nbRows.current = board.length;
          nbCols.current = board[0].length;

          ratioX.current = roundTwo(
            maxWidth.current / board[0].length / PIXEL_BY_SQUARE
          );
          ratioY.current = roundTwo(
            maxHeight.current / board.length / PIXEL_BY_SQUARE
          );
        });
      }
    }
  }, []); // Empty array ensures that effect is only run on mount and unmount

  useEffect(() => {
    document.addEventListener("keydown", function (event) {
      keystate[event.code] = true;
    });
    document.addEventListener("keyup", function (event) {
      delete keystate[event.code];
    });
  }); // Do not add empty arrays, otherwise it will not add event listeners after re-render

  useEffect(() => {
    const updateMatrix = (players: Player[] = [], board: Square[][]) => {
      for (let r = 0; r < board.length; r++) {
        for (let c = 0; c < board[0].length; c++) {
          colorSquare(`${r}-${c}`, board[r][c].color);
        }
      }
      //   const rowHeight = Math.round(maxHeight.current / nbRows.current);
      //   const colWidth = Math.round(maxWidth.current / nbCols.current);

      //   const rowDisplayHeight = ratioY.current / rowHeight;
      //   const colDisplayWidth = ratioX.current / colWidth;

      //   if (players) {
      //     players.forEach((player) => {
      //       const goodRow = Math.floor(player.y * rowDisplayHeight);
      //       const goodCol = Math.floor(player.x * colDisplayWidth);
      //       colorSquare(`${goodRow}-${goodCol}`, player.color);
      //     });
      //   }
    };

    const draw = (ctx: CanvasRenderingContext2D, players: Player[] = []) => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      players.forEach(function ({ x, y, size, color }) {
        ctx.beginPath();
        //   ctx.arc(x, y, size / 2, 0, 2 * Math.PI);
        const xDisplay = (x - size / 2) * ratioX.current;
        const yDisplay = (y - size / 2) * ratioY.current;
        ctx.rect(
          xDisplay,
          yDisplay,
          size * ratioX.current,
          size * ratioY.current
        );
        ctx.fillStyle = color;
        ctx.fill();
        writeText(ctx, { x: xDisplay, y: yDisplay, text: `x=${x} y=${y}` });

        // ctx.fillStyle = "black";
        // ctx.fillText(`x=${x} y=${y}`, x, y);
      });
    };

    if (socketService.socket && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        gameService.onUpdateBoard(
          socketService.socket,
          ({ players, board }) => {
            draw(context, players);
            updateMatrix(players, board);
            // setBoard(board);
          }
        );
      }
    }
  }, []);

  useEffect(() => {
    let animationFrameId: number;
    // Game loop
    const updateMove = () => {
      move();
      animationFrameId = window.requestAnimationFrame(updateMove);
    };
    updateMove();
    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [move]);

  return (
    <div>
      <div className="container">
        {board.map((row, rowIdx) => {
          return (
            <div key={rowIdx} className="test-row">
              {row.map((column, columnIdx) => (
                <div
                  key={rowIdx.toString() + "-" + columnIdx.toString()}
                  id={rowIdx.toString() + "-" + columnIdx.toString()}
                  className="test-square"
                  style={{ backgroundColor: column.color }}
                ></div>
              ))}
            </div>
          );
        })}
        <canvas key="my-canvas" className="canvas" ref={canvasRef} />
      </div>
    </div>
  );
}
