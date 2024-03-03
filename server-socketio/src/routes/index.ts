import express from "express";
import axios from "axios";
import { load as cheerioLoad } from "cheerio";

const router = express.Router();

/* GET home page. */
router.get("/", function (req, res) {
  res.send("Hello Boy!!");
});

router.get("/word/:word", async function (req, res) {
  const word = req.params.word;
  const definition = await getDefinitionFromPage(word);
  res.send({ word, definition });
});

router.get("/nums/:num", async function (req, res, next) {
  const num = req.params.num;
  console.log("YO num", num);
  const word = await getWordFromPage(num);
  res.json({ num, word });
});

const getDefinitionFromPage = async (word: string) => {
  const { data } = await axios.get(
    `https://www.larousse.fr/dictionnaires/francais/${word}`
  );
  const $ = cheerioLoad(data);
  const definition = $(".DivisionDefinition:first")
    .first()
    .contents()
    .filter(
      (_, elem: any) => elem.name !== "p" && elem.attribs?.class !== "numDef"
    )
    .text();
  return definition.trim();
};

const getWordFromPage = async (num: number) => {
  const { data } = await axios.get(
    `https://www.larousse.fr/dictionnaires/francais/someword/${num}`
  );
  const $ = cheerioLoad(data);
  const words = $("h2.AdresseDefinition")
    .first()
    .contents()
    .filter((_, elem) => elem.nodeType === 3) // nodeType === 3 is text
    .text();
  const word = words.split(",")[0];
  return word.trim();
};

export { router };
