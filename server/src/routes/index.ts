import express from 'express';
import axios from 'axios';
import { CheerioAPI, load as cheerioLoad } from 'cheerio';
import { getRandomWord } from '../socket/utils';
import { io } from '../server';

const router = express.Router();

const dictionaryUrl = 'https://www.larousse.fr/dictionnaires/francais';
const MAX_WORDS = 83296;

router.get('/', function (_, res) {
  res.send('Hello Boy!!');
});

router.get('/word/:word', async function (req, res) {
  const word = req.params.word;
  const wordUrl = `${dictionaryUrl}/${word}`;
  const definition = await getDefinitionFromPage(wordUrl);
  res.send({ word, definition });
});

router.get('/nums/:num', async function (req, res) {
  const num = req.params.num;
  const word = await getWordFromPage(num);
  res.json({ num, word });
});

router.get('/reset', async function (_, res) {
  io.emit('reset_sockets', { message: 'System reset triggered' });
  res.json({ ok: true });
});

const getPage = async (url: string) => {
  const { data } = await axios.get(url);
  return cheerioLoad(data);
};

const getDefinitionFromPage = async (pageUrl: string) => {
  const $ = await getPage(pageUrl);
  return extractDefinition($);
};

export const getWordFromPage = async (num: number) => {
  const $ = await getPage(`${dictionaryUrl}/someword/${num}`);
  return extractWord($);
};

export const getDefinitionFromNum = async (
  num: number,
): Promise<{ word: string; definition: string }> => {
  const $ = await getPage(`${dictionaryUrl}/someword/${num}`);
  return { word: extractWord($), definition: extractDefinition($) };
};

export const getFakeDefinition = (): {
  word: string;
  definition: string;
} => {
  const word = getRandomWord();
  const realDefinition =
    'the real definition the real definition the real definition the real definition the real definition the real definition the real definition the real definition';
  return { word, definition: realDefinition };
};

export const getWordAndDefinition = async (): Promise<{
  word: string;
  definition: string;
}> => {
  if (process.env.NODE_ENV === 'development') {
    return getFakeDefinition();
  }
  const num = getRandomDictNumber();
  return getDefinitionFromNum(num);
};

const extractDefinition = ($: CheerioAPI) => {
  const definition = $('.DivisionDefinition:first')
    .first()
    .contents()
    .filter(
      (_, elem: any) => elem.name !== 'p' && elem.attribs?.class !== 'numDef',
    )
    .text();
  return definition.trim();
};

export const extractWord = ($: CheerioAPI) => {
  const words = $('h2.AdresseDefinition')
    .first()
    .contents()
    .filter((_, elem) => elem.nodeType === 3) // nodeType === 3 is text
    .text();
  const word = words.split(',')[0];
  return word.trim();
};

export const getRandomDictNumber = () => {
  return Math.floor(Math.random() * MAX_WORDS);
};

export { router };
