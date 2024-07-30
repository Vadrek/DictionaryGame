import express from "express";
import axios from "axios";
import { CheerioAPI, load as cheerioLoad } from "cheerio";

const router = express.Router();

const dictionaryUrl = "https://www.larousse.fr/dictionnaires/francais";

router.get("/", function (req, res) {
  res.send("Hello Boy!!");
});

router.get("/word/:word", async function (req, res) {
  const word = req.params.word;
  const wordUrl = `${dictionaryUrl}/${word}`;
  const definition = await getDefinitionFromPage(wordUrl);
  res.send({ word, definition });
});

router.get("/nums/:num", async function (req, res, next) {
  const num = req.params.num;
  const word = await getWordFromPage(num);
  res.json({ num, word });
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

export const getDefinitionFromNum = async (num: number) => {
  const $ = await getPage(`${dictionaryUrl}/someword/${num}`);
  return { word: extractWord($), definition: extractDefinition($) };
};

const extractDefinition = ($: CheerioAPI) => {
  const definition = $(".DivisionDefinition:first")
    .first()
    .contents()
    .filter(
      (_, elem: any) => elem.name !== "p" && elem.attribs?.class !== "numDef"
    )
    .text();
  return definition.trim();
};

export const extractWord = ($: CheerioAPI) => {
  const words = $("h2.AdresseDefinition")
    .first()
    .contents()
    .filter((_, elem) => elem.nodeType === 3) // nodeType === 3 is text
    .text();
  const word = words.split(",")[0];
  return word.trim();
};

export const getRandomDictNumber = () => {
  return Math.floor(Math.random() * 83296);
};

export { router };
