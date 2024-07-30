export function getRandomWord() {
  const words = [
    "red",
    "blue",
    "green",
    "yellow",
    "black",
    "white",
    "purple",
    "orange",
    "pink",
    "brown",
    "grey",
  ];
  return words[Math.floor(Math.random() * words.length)];
}

const randomNames = [
  "Alice",
  "Bob",
  "Charlie",
  "David",
  "Eve",
  "Frank",
  "Grace",
  "Heidi",
  "Ivan",
  "Judy",
  "Mallory",
  "Oscar",
];

export function getRandomUsername() {
  const randomNumber = Math.floor(Math.random() * randomNames.length);
  return randomNames[randomNumber];
}
