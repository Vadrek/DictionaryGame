"use client";
import { useRef, useEffect, useState } from "react";
import { canvasGameService } from "./canvasGameService";
import { Player, Square } from "./canvasGameService/type";
import { roundTwo } from "./canvasGameService/utils";
import { colorSquare, writeText } from "./helpers";
import { useSocket } from "@/socket/hook";

import "./canvas.css";

import styles from "./App.module.css";

const PIXEL_BY_SQUARE = 10;

function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keystate: Record<string, boolean> = {};

  const maxWidth = useRef(0);
  const maxHeight = useRef(0);
  const ratioX = useRef(0);
  const ratioY = useRef(0);
  const nbRows = useRef(0);
  const nbCols = useRef(0);

  const [board, setBoard] = useState([] as Square[][]);

  const socket = useSocket();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const move = () => {
    if (socket) {
      if (keystate.ArrowUp) {
        canvasGameService.movePlayer(socket, {
          direction: "UP",
        });
      }
      if (keystate.ArrowDown)
        canvasGameService.movePlayer(socket, {
          direction: "DOWN",
        });
      if (keystate.ArrowLeft)
        canvasGameService.movePlayer(socket, {
          direction: "LEFT",
        });
      if (keystate.ArrowRight) {
        canvasGameService.movePlayer(socket, {
          direction: "RIGHT",
        });
      }
    }
  };

  const updateMatrix = (board: Square[][]) => {
    for (let r = 0; r < board.length; r++) {
      for (let c = 0; c < board[0].length; c++) {
        colorSquare(`${r}-${c}`, board[r][c].color);
      }
    }
  };

  const draw = (ctx: CanvasRenderingContext2D, players: Player[] = []) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    players.forEach(function ({ x, y, size, color }) {
      ctx.arc(x, y, size / 2, 0, 2 * Math.PI);
      ctx.beginPath();
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
    });
  };

  useEffect(() => {
    if (canvasRef.current) {
      maxWidth.current = canvasRef.current.offsetWidth;
      maxHeight.current = canvasRef.current.offsetHeight;
      canvasRef.current.width = canvasRef.current.offsetWidth;
      canvasRef.current.height = canvasRef.current.offsetHeight;

      if (socket) {
        canvasGameService.onInitBoard(socket, (board) => {
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

        const context = canvasRef.current.getContext("2d");
        if (context) {
          canvasGameService.onUpdateBoard(socket, ({ players, board }) => {
            draw(context, players);
            updateMatrix(board);
          });
        }
      }
    }
  }, [socket]);

  useEffect(() => {
    document.addEventListener("keydown", function (event) {
      keystate[event.code] = true;
    });
    document.addEventListener("keyup", function (event) {
      delete keystate[event.code];
    });
  }); // Do not add empty arrays, otherwise it will not add event listeners after re-render

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
        {board.map((row, rowIdx) => (
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
        ))}
        <canvas key="my-canvas" className="canvas" ref={canvasRef} />
      </div>
    </div>
  );
}

function CanvasPage() {
  return (
    <div className={styles.appContainer}>
      <h1 className={styles.welcomeText}>{"welcomeText"}</h1>
      <div className={styles.mainContainer}>
        <Canvas />
      </div>
    </div>
  );
}

export default CanvasPage;
