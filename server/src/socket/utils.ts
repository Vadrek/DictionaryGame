export function getRandomWord() {
  const words = [
    'red',
    'blue',
    'green',
    'yellow',
    'black',
    'white',
    'purple',
    'orange',
    'pink',
    'brown',
    'grey',
  ];
  return words[Math.floor(Math.random() * words.length)];
}

const randomNames = [
  'Assurancetourix',
  'Astérix',
  'Bonnemine',
  'Canalplus',
  'Cartapus',
  'Cétautomatix',
  'Choucroutgarnix',
  'Cléopâtre',
  'Falbala',
  'Goudurix',
  'Hypothénus',
  'Idéfix',
  'Jules César',
  'Marchéopus',
  'Numérobis',
  'Obélix',
  'Ordralfabétix',
  'Panoramix',
  'Pleindastus',
  'Prospectus',
  'Vercingétorix',
];

export function getRandomUsername() {
  const randomNumber = Math.floor(Math.random() * randomNames.length);
  return randomNames[randomNumber];
}
