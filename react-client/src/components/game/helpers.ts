export const colorSquare = (id: string, color: string) => {
  const square = document.getElementById(id);
  if (square) {
    square.style.backgroundColor = color;
  }
};

export const writeText = (
  ctx: CanvasRenderingContext2D,
  info: { x: number; y: number; text: string }
) => {
  const { text, x, y } = info;

  const fontSize = 20;
  const fontFamily = "Arial";
  const color = "black";
  const textAlign = "left";
  const textBaseline = "top";
  ctx.beginPath();
  ctx.font = fontSize + "px " + fontFamily;
  ctx.textAlign = textAlign;
  ctx.textBaseline = textBaseline;
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
  ctx.stroke();
};
